import { GeminiProvider } from './gemini.js';
import { GroqProvider } from './groq.js';

/**
 * Provider factory - returns the appropriate provider based on configuration
 */
export function getProvider(preferredProvider = null) {
  const provider = preferredProvider || process.env.AI_PROVIDER || 'gemini';

  if (provider === 'groq') {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      throw new Error('GROQ_API_KEY environment variable not set. Please configure it in .env.local');
    }
    return new GroqProvider(groqKey);
  }

  // Default to Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY environment variable not set. Please configure it in .env.local');
  }
  return new GeminiProvider(geminiKey);
}

/**
 * Get provider with fallback support
 * Tries primary provider, falls back to secondary if primary fails
 */
export async function getProviderWithFallback() {
  const primary = process.env.AI_PROVIDER || 'gemini';
  const secondary = primary === 'gemini' ? 'groq' : 'gemini';

  return {
    primary: getProvider(primary),
    secondary: (() => {
      try {
        return getProvider(secondary);
      } catch (e) {
        return null;
      }
    })(),
    primaryName: primary,
    secondaryName: secondary,
  };
}
