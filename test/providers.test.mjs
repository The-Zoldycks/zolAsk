import assert from 'node:assert/strict';
import test from 'node:test';
import { getProviderWithFallback } from '../lib/providers/index.js';

test('uses the secondary provider when the primary provider fails', async () => {
  const originalFetch = global.fetch;
  const originalProvider = process.env.AI_PROVIDER;
  process.env.AI_PROVIDER = 'gemini'; process.env.GEMINI_API_KEY = 'primary'; process.env.GROQ_API_KEY = 'secondary';
  global.fetch = async (url) => {
    if (url.includes('googleapis')) return new Response('unavailable', { status: 503 });
    return Response.json({ choices: [{ message: { content: JSON.stringify({ nextQuestion: 'Who is it for?', suggestions: ['Teams', 'Students', 'Founders'] }) } }] });
  };
  try {
    const result = await getProviderWithFallback('suggestions', { originalInput: 'Build a product', selectedSuggestions: [], customInputs: [] });
    assert.equal(result.nextQuestion, 'Who is it for?');
  } finally {
    global.fetch = originalFetch;
    if (originalProvider === undefined) delete process.env.AI_PROVIDER; else process.env.AI_PROVIDER = originalProvider;
  }
});
