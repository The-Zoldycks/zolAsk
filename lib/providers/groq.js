import { fetchWithTimeout, extractOpenAIJson } from '../ai.js';
import { BaseProvider } from './base.js';

const ANALYZE_PROMPT = `Return JSON only with category, goal, knownParameters (object), missingParameters (array), nextQuestion, and 3-6 short suggestions. You are a careful prompt engineering assistant.`;
const SUGGESTIONS_PROMPT = `Return JSON only with nextQuestion and 3-6 short, actionable suggestions for the provided prompt state.`;
const FINAL_PROMPT = `Return JSON only with prompt and summary. Create a concise, concrete, ready-to-use prompt from the provided state.`;

export class GroqProvider extends BaseProvider {
  constructor(apiKey) {
    super(apiKey);
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
  }

  async request(systemPrompt, input, expectedType) {
    const response = await fetchWithTimeout(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        model: this.model,
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: input }],
        temperature: 0.5,
        max_tokens: expectedType === 'prompt' ? 2048 : 1024,
        response_format: { type: 'json_object' },
      }),
    });
    return this.assertResponse(extractOpenAIJson(await response.json()), expectedType);
  }

  analyzeRequest(userRequest) { return this.request(ANALYZE_PROMPT, `User request: ${userRequest}`, 'analyze'); }
  generateSuggestions(promptState) { return this.request(SUGGESTIONS_PROMPT, `Prompt state: ${JSON.stringify(promptState)}`, 'suggestions'); }
  generatePrompt(promptState) { return this.request(FINAL_PROMPT, `Prompt state: ${JSON.stringify(promptState)}`, 'prompt'); }
}
