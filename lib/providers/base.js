import { validateProviderResponse } from '../contracts.js';

export class BaseProvider {
  constructor(apiKey) {
    if (!apiKey) throw new Error(`${this.constructor.name} requires an API key`);
    this.apiKey = apiKey;
  }

  validateResponse(response, expectedType) {
    return validateProviderResponse(response, expectedType);
  }

  assertResponse(response, expectedType) {
    if (!this.validateResponse(response, expectedType)) {
      throw new Error('Provider returned an invalid response structure');
    }
    return response;
  }
}
