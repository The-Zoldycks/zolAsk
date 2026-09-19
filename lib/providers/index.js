import { GeminiProvider } from './gemini.js';
import { GroqProvider } from './groq.js';

export function getProvider(preferredProvider) {
  const provider = preferredProvider || process.env.AI_PROVIDER || 'gemini';
  if (provider === 'groq') {
    if (!process.env.GROQ_API_KEY) throw new Error('Groq is not configured');
    return new GroqProvider(process.env.GROQ_API_KEY);
  }
  if (provider !== 'gemini') throw new Error(`Unsupported AI provider: ${provider}`);
  if (!process.env.GEMINI_API_KEY) throw new Error('Gemini is not configured');
  return new GeminiProvider(process.env.GEMINI_API_KEY);
}

export async function getProviderWithFallback(operation, input) {
  const primaryName = process.env.AI_PROVIDER || 'gemini';
  const secondaryName = primaryName === 'gemini' ? 'groq' : 'gemini';
  const providers = [primaryName, secondaryName];
  let primaryError;

  for (const providerName of providers) {
    try {
      const provider = getProvider(providerName);
      return await provider[operation === 'analyze' ? 'analyzeRequest' : operation === 'suggestions' ? 'generateSuggestions' : 'generatePrompt'](input);
    } catch (error) {
      if (!primaryError) primaryError = error;
      console.warn(`${providerName} ${operation} failed; trying next provider.`);
    }
  }
  throw primaryError || new Error('No AI provider is configured');
}
