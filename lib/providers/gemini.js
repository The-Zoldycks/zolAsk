import { BaseProvider } from './base.js';

/**
 * Gemini AI Provider
 * Uses Google's Gemini API for prompt analysis and generation
 */
export class GeminiProvider extends BaseProvider {
  constructor(apiKey) {
    super(apiKey);
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    this.model = 'gemini-3.5-flash';
  }

  /**
   * Analyze user request and return structured response
   */
  async analyzeRequest(userRequest) {
    const systemPrompt = `You are an expert prompt engineering assistant. Analyze the user's request and return a JSON response with:
{
  "category": "one of: image_generation, writing, coding, website_development, marketing, research, business, creative_writing, general",
  "goal": "summary of what the user is trying to accomplish",
  "knownParameters": { "param": "value" },
  "missingParameters": ["array of important missing details"],
  "nextQuestion": "The most important question to ask next",
  "suggestions": ["3-6 relevant suggestions for the next step"]
}

Ensure suggestions are relevant, concise, and context-aware. Return ONLY valid JSON.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nUser request: "${userRequest}"`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response from Gemini API');
      }

      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text];
      const jsonText = jsonMatch[1] || text;
      const parsed = JSON.parse(jsonText);

      return this.validateResponse(parsed, 'analyze') ? parsed : { error: 'Invalid response structure' };
    } catch (error) {
      throw new Error(`Gemini analyzeRequest failed: ${error.message}`);
    }
  }

  /**
   * Generate suggestions based on current prompt state
   */
  async generateSuggestions(promptState) {
    const systemPrompt = `You are a prompt engineering expert. Based on the user's current prompt state, generate 3-6 contextually relevant suggestions for improving the prompt. Return ONLY a JSON object with this structure:
{
  "nextQuestion": "The key question to ask",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3", ...]
}

Suggestions should be short (1-3 words), relevant to the task, and actionable.`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nCurrent prompt state:\n${JSON.stringify(promptState, null, 2)}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response from Gemini API');
      }

      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text];
      const jsonText = jsonMatch[1] || text;
      const parsed = JSON.parse(jsonText);

      return this.validateResponse(parsed, 'suggestions') ? parsed : { error: 'Invalid response structure' };
    } catch (error) {
      throw new Error(`Gemini generateSuggestions failed: ${error.message}`);
    }
  }

  /**
   * Generate the final prompt
   */
  async generatePrompt(promptState) {
    const systemPrompt = `You are an expert prompt engineer. Create a polished, focused prompt based on the user's current state. 
    
Rules:
- Incorporate all selected suggestions and custom inputs
- Maintain the original user intent
- Keep the prompt concise but complete
- Only include relevant details
- Do not add unnecessary fluff
- Make it immediately usable by the target AI/tool

Return ONLY a JSON object with this structure:
{
  "prompt": "The final polished prompt here",
  "summary": "Brief summary of what the prompt does"
}`;

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${systemPrompt}\n\nCurrent prompt state:\n${JSON.stringify(promptState, null, 2)}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response from Gemini API');
      }

      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text];
      const jsonText = jsonMatch[1] || text;
      const parsed = JSON.parse(jsonText);

      return this.validateResponse(parsed, 'prompt') ? parsed : { error: 'Invalid response structure' };
    } catch (error) {
      throw new Error(`Gemini generatePrompt failed: ${error.message}`);
    }
  }
}
