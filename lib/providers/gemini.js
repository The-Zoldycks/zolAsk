import { BaseProvider } from './base.js';

/**
 * Gemini AI Provider
 * Uses Google's Gemini API for prompt analysis and generation
 */
export class GeminiProvider extends BaseProvider {
  constructor(apiKey) {
    super(apiKey);
    this.apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent';
    this.model = 'gemini-3.5-flash-lite';
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
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                category: { type: 'STRING' },
                goal: { type: 'STRING' },
                knownParameters: { type: 'OBJECT' },
                missingParameters: { type: 'ARRAY', items: { type: 'STRING' } },
                nextQuestion: { type: 'STRING' },
                suggestions: { type: 'ARRAY', items: { type: 'STRING' } },
              },
              required: ['category', 'goal', 'nextQuestion', 'suggestions'],
            },
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

      // With responseMimeType: "application/json", text should already be valid JSON
      // But handle markdown code blocks as fallback
      let jsonText = text.trim();
      const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/) || jsonText.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message, '\nRaw text:', text);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }

      return this.validateResponse(parsed, 'analyze') ? parsed : { error: 'Invalid response structure' };
    } catch (error) {
      throw new Error(`Gemini analyzeRequest failed: ${error.message}`);
    }
  }

  /**
   * Generate suggestions based on current prompt state
   */
  async generateSuggestions(promptState) {
  const systemPrompt = `You are a prompt engineering expert.

Based on the user's current prompt state, generate 3-6 contextually relevant suggestions for improving the prompt.

Return a JSON object with exactly this structure:
{
  "nextQuestion": "The key question to ask",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Rules:
- suggestions must contain 3 to 6 items
- each suggestion must be 1 to 3 words
- suggestions must be relevant to the user's task
- suggestions must be actionable
- nextQuestion should be the single most important missing detail`;

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
                text: `${systemPrompt}

Current prompt state:
${JSON.stringify(promptState, null, 2)}`,
              },
            ],
          },
        ],

        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',

          responseSchema: {
            type: 'OBJECT',
            properties: {
              nextQuestion: {
                type: 'STRING',
              },
              suggestions: {
                type: 'ARRAY',
                items: {
                  type: 'STRING',
                },
              },
            },
            required: [
              'nextQuestion',
              'suggestions',
            ],
          },
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();

      throw new Error(
        `Gemini API error ${response.status}: ${errorBody}`
      );
    }

    const data = await response.json();

    console.log('Gemini response:');
    console.dir(data, { depth: null });

    const candidate = data.candidates?.[0];

    if (!candidate) {
      throw new Error('Gemini returned no candidate');
    }

    const text = candidate.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini returned no text');
    }

    console.log('Raw Gemini text:', text);

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed JSON:', text);

      throw new Error(
        `Invalid JSON response: ${parseError.message}`
      );
    }

    if (!this.validateResponse(parsed, 'suggestions')) {
      return {
        error: 'Invalid response structure',
      };
    }

    return parsed;

  } catch (error) {
    throw new Error(
      `Gemini generateSuggestions failed: ${error.message}`
    );
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
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                prompt: { type: 'STRING' },
                summary: { type: 'STRING' },
              },
              required: ['prompt', 'summary'],
            },
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

      let jsonText = text.trim();
      const jsonMatch = jsonText.match(/```json\n([\s\S]*?)\n```/) || jsonText.match(/```\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }

      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message, '\nRaw text:', text);
        throw new Error(`Invalid JSON response: ${parseError.message}`);
      }

      return this.validateResponse(parsed, 'prompt') ? parsed : { error: 'Invalid response structure' };
    } catch (error) {
      throw new Error(`Gemini generatePrompt failed: ${error.message}`);
    }
  }
}
