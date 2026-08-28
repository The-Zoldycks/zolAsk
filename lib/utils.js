/**
 * Utility functions for zolAsk
 */

/**
 * Parse and validate JSON response from AI provider
 * Handles errors gracefully
 */
export function parseAIResponse(text) {
  if (!text) {
    return null;
  }

  try {
    // Handle markdown code blocks
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                     text.match(/```\n([\s\S]*?)\n```/) || 
                     [null, text];
    const jsonText = jsonMatch[1] || text;
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return null;
  }
}

/**
 * Format prompt state into a readable summary
 */
export function formatPromptState(state) {
  if (!state) return '';

  const parts = [];

  if (state.originalInput) {
    parts.push(`Original Request: ${state.originalInput}`);
  }

  if (state.category) {
    parts.push(`Category: ${state.category}`);
  }

  if (state.parameters && Object.keys(state.parameters).length > 0) {
    parts.push('Parameters:');
    Object.entries(state.parameters).forEach(([key, value]) => {
      if (value) {
        parts.push(`  • ${key}: ${value}`);
      }
    });
  }

  if (state.selectedSuggestions && state.selectedSuggestions.length > 0) {
    parts.push(`Selected: ${state.selectedSuggestions.join(', ')}`);
  }

  if (state.customInputs && state.customInputs.length > 0) {
    parts.push(`Custom Additions: ${state.customInputs.join(', ')}`);
  }

  return parts.join('\n');
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Debounce a function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
