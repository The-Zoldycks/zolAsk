import { parseAIResponse } from './utils.js';

const DEFAULT_TIMEOUT_MS = 25_000;

export async function fetchWithTimeout(url, options, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Provider returned HTTP ${response.status}`);
    }
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Provider request timed out');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function extractGeminiJson(data) {
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return parseAIResponse(text);
}

export function extractOpenAIJson(data) {
  return parseAIResponse(data.choices?.[0]?.message?.content);
}
