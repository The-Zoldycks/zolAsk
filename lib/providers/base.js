/**
 * Base provider class for AI interactions
 * All providers should extend this class
 */
export class BaseProvider {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error(`${this.constructor.name} requires an API key`);
    }
    this.apiKey = apiKey;
  }

  /**
   * Analyze a user request and return structured response
   * @param {string} userRequest - The user's initial input
   * @returns {Promise<Object>} Structured analysis response
   */
  async analyzeRequest(userRequest) {
    throw new Error('analyzeRequest() must be implemented by subclass');
  }

  /**
   * Generate suggestions based on current prompt state
   * @param {Object} promptState - Current state of the prompt
   * @returns {Promise<Object>} Suggestions response
   */
  async generateSuggestions(promptState) {
    throw new Error('generateSuggestions() must be implemented by subclass');
  }

  /**
   * Generate/refine the final prompt
   * @param {Object} promptState - Current state of the prompt
   * @returns {Promise<Object>} Final prompt response
   */
  async generatePrompt(promptState) {
    throw new Error('generatePrompt() must be implemented by subclass');
  }

  /**
   * Validate API response structure
   * @param {Object} response - Response from AI provider
   * @param {string} expectedType - Type of response expected (analyze|suggestions|prompt)
   * @returns {boolean} Whether response is valid
   */
  validateResponse(response, expectedType) {
    if (!response || typeof response !== 'object') {
      return false;
    }
    return true;
  }
}
