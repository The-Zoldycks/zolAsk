import { fetchWithTimeout, extractGeminiJson } from '../ai.js';
import { BaseProvider } from './base.js';

const ANALYZE_PROMPT = `You are a prompt engineering assistant. Return JSON only with category, goal, knownParameters (object), missingParameters (array), nextQuestion, and 3-6 short suggestions. Analyze the user's request thoughtfully.`;
const SUGGESTIONS_PROMPT = `You are a prompt engineering assistant. Return JSON only with nextQuestion and 3-6 short, actionable suggestions. Ask for the most useful missing detail.`;
const FINAL_PROMPT = `You are a prompt engineering assistant. Return JSON only with prompt and summary. Preserve the original intent; incorporate selected suggestions and custom inputs; make the prompt concise, concrete, and ready to use.`;

export class GeminiProvider extends BaseProvider {
  constructor(apiKey) {
    super(apiKey);
    this.model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    this.apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;
  }

  async request(systemPrompt, input, expectedType) {
    const response = await fetchWithTimeout(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.apiKey },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${input}` }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: expectedType === 'prompt' ? 2048 : 1024, responseMimeType: 'application/json' },
      }),
    });
    return this.assertResponse(extractGeminiJson(await response.json()), expectedType);
  }

  analyzeRequest(userRequest) { return this.request(ANALYZE_PROMPT, `User request: ${userRequest}`, 'analyze'); }
  generateSuggestions(promptState) { return this.request(SUGGESTIONS_PROMPT, `Prompt state: ${JSON.stringify(promptState)}`, 'suggestions'); }
  generatePrompt(promptState) { return this.request(FINAL_PROMPT, `Prompt state: ${JSON.stringify(promptState)}`, 'prompt'); }
}
