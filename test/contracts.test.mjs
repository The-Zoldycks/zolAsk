import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizePromptState, validateProviderResponse } from '../lib/contracts.js';
import { createPromptRoute } from '../lib/api.js';

test('normalizes prompt state and removes duplicate details', () => {
  const state = normalizePromptState({ originalInput: ' Build a landing page ', selectedSuggestions: ['Minimal', 'Minimal'], customInputs: ['For a bakery'], parameters: {} });
  assert.deepEqual(state.selectedSuggestions, ['Minimal']);
  assert.equal(state.originalInput, 'Build a landing page');
});

test('rejects malformed prompt state', () => {
  assert.equal(normalizePromptState({ originalInput: '', selectedSuggestions: [] }), null);
  assert.equal(normalizePromptState({ originalInput: 'x', selectedSuggestions: 'nope' }), null);
});

test('validates provider response contracts', () => {
  assert.equal(validateProviderResponse({ nextQuestion: 'Who is the audience?', suggestions: ['Founders', 'Creators', 'Teams'] }, 'suggestions'), true);
  assert.equal(validateProviderResponse({ nextQuestion: 'Who is the audience?', suggestions: ['Only one'] }, 'suggestions'), false);
  assert.equal(validateProviderResponse({ prompt: 'Write a concise launch email.', summary: 'Launch email' }, 'prompt'), true);
});

test('rejects invalid API input before a provider is called', async () => {
  const route = createPromptRoute({ operation: 'analyze', responseType: 'analyze' });
  const response = await route(new Request('http://localhost/api/analyze', { method: 'POST', body: JSON.stringify({ userRequest: '' }) }));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: 'The request is missing valid prompt data.' });
});
