const MAX_REQUEST_LENGTH = 6000;
const MAX_ITEM_LENGTH = 240;

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isShortString(value, maxLength = MAX_ITEM_LENGTH) {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isStringList(value, { min = 0, max = 20 } = {}) {
  return Array.isArray(value) && value.length >= min && value.length <= max && value.every((item) => isShortString(item));
}

export function normalizePromptState(value) {
  if (!isPlainObject(value) || !isShortString(value.originalInput, MAX_REQUEST_LENGTH)) {
    return null;
  }

  const selectedSuggestions = value.selectedSuggestions ?? [];
  const customInputs = value.customInputs ?? [];
  if (!isStringList(selectedSuggestions, { max: 12 }) || !isStringList(customInputs, { max: 12 })) {
    return null;
  }

  return {
    originalInput: value.originalInput.trim(),
    category: isShortString(value.category) ? value.category.trim() : '',
    goal: isShortString(value.goal, 600) ? value.goal.trim() : '',
    parameters: isPlainObject(value.parameters) ? value.parameters : {},
    missingParameters: isStringList(value.missingParameters, { max: 12 }) ? value.missingParameters : [],
    selectedSuggestions: [...new Set(selectedSuggestions.map((item) => item.trim()))],
    customInputs: [...new Set(customInputs.map((item) => item.trim()))],
    currentPrompt: isShortString(value.currentPrompt, MAX_REQUEST_LENGTH) ? value.currentPrompt.trim() : '',
    summary: isShortString(value.summary, 600) ? value.summary.trim() : '',
  };
}

export function validateAnalysisResponse(value) {
  return isPlainObject(value)
    && isShortString(value.category)
    && isShortString(value.goal, 600)
    && isPlainObject(value.knownParameters)
    && isStringList(value.missingParameters, { max: 12 })
    && isShortString(value.nextQuestion, 600)
    && isStringList(value.suggestions, { min: 3, max: 6 });
}

export function validateSuggestionsResponse(value) {
  return isPlainObject(value)
    && isShortString(value.nextQuestion, 600)
    && isStringList(value.suggestions, { min: 3, max: 6 });
}

export function validatePromptResponse(value) {
  return isPlainObject(value)
    && isShortString(value.prompt, MAX_REQUEST_LENGTH)
    && isShortString(value.summary, 600);
}

export function validateProviderResponse(value, expectedType) {
  if (expectedType === 'analyze') return validateAnalysisResponse(value);
  if (expectedType === 'suggestions') return validateSuggestionsResponse(value);
  if (expectedType === 'prompt') return validatePromptResponse(value);
  return false;
}

export { MAX_REQUEST_LENGTH };
