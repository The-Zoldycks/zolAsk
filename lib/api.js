import { getProviderWithFallback } from './providers/index.js';
import { normalizePromptState, validateProviderResponse } from './contracts.js';
import { rateLimit } from './rate-limit.js';

const MAX_BODY_BYTES = 16_000;

function clientId(request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'anonymous';
}

async function readJson(request) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) throw new ApiError('Request body is too large', 413);
  try {
    return await request.json();
  } catch {
    throw new ApiError('Request body must be valid JSON', 400);
  }
}

class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

export function createPromptRoute({ operation, responseType }) {
  return async function POST(request) {
    const limit = rateLimit(clientId(request));
    if (!limit.allowed) {
      return Response.json({ error: 'Too many requests. Please try again shortly.' }, {
        status: 429,
        headers: { 'Retry-After': String(limit.retryAfter) },
      });
    }

    try {
      const body = await readJson(request);
      const input = operation === 'analyze'
        ? typeof body.userRequest === 'string' && body.userRequest.trim().length <= 6000
          ? body.userRequest.trim()
          : null
        : normalizePromptState(body.promptState);

      if (!input) throw new ApiError('The request is missing valid prompt data.', 400);

      const result = await getProviderWithFallback(operation, input);
      if (!validateProviderResponse(result, responseType)) {
        throw new ApiError('The AI returned an invalid response. Please try again.', 502);
      }
      return Response.json(result);
    } catch (error) {
      const status = error instanceof ApiError ? error.status : 502;
      if (status >= 500) console.error(`Prompt ${operation} failed:`, error.message);
      return Response.json({ error: error.message || 'Unable to process your request.' }, { status });
    }
  };
}
