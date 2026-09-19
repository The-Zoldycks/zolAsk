'use client';

import { useCallback, useState } from 'react';

const initialState = {
  originalInput: '', category: '', goal: '', parameters: {}, missingParameters: [],
  selectedSuggestions: [], customInputs: [], currentPrompt: '', summary: '',
};

async function request(path, body) {
  const response = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Unable to complete that request.');
  return data;
}

export function usePromptBuilder() {
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [step, setStep] = useState('input');

  const analyzeRequest = useCallback(async (userRequest) => {
    setLoading(true); setError(''); setStep('analyzing');
    try {
      const analysis = await request('/api/analyze', { userRequest });
      setState({ ...initialState, originalInput: userRequest, category: analysis.category, goal: analysis.goal, parameters: analysis.knownParameters, missingParameters: analysis.missingParameters });
      setCurrentQuestion(analysis.nextQuestion); setCurrentSuggestions(analysis.suggestions); setStep('suggestions');
    } catch (err) { setError(err.message); setStep('input'); } finally { setLoading(false); }
  }, []);

  const updateSuggestions = useCallback(async (nextState) => {
    const result = await request('/api/suggestions', { promptState: nextState });
    setCurrentQuestion(result.nextQuestion); setCurrentSuggestions(result.suggestions);
  }, []);

  const addValue = useCallback(async (field, value) => {
    if (!value || loading || state[field].includes(value)) return;
    const nextState = { ...state, [field]: [...state[field], value] };
    setState(nextState); setLoading(true); setError('');
    try { await updateSuggestions(nextState); } catch (err) { setState(state); setError(err.message); } finally { setLoading(false); }
  }, [loading, state, updateSuggestions]);

  const removeValue = useCallback((field, value) => {
    setState((current) => ({ ...current, [field]: current[field].filter((item) => item !== value) }));
  }, []);

  const generateFinalPrompt = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await request('/api/prompt', { promptState: state });
      setState((current) => ({ ...current, currentPrompt: result.prompt, summary: result.summary })); setStep('prompt');
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, [state]);

  const refinePrompt = useCallback(async () => {
    setStep('suggestions'); setLoading(true); setError('');
    try { await updateSuggestions(state); } catch (err) { setError(err.message); } finally { setLoading(false); }
  }, [state, updateSuggestions]);

  const editPrompt = useCallback((currentPrompt) => setState((current) => ({ ...current, currentPrompt })), []);
  const resetAll = useCallback(() => { setState(initialState); setCurrentQuestion(''); setCurrentSuggestions([]); setStep('input'); setError(''); setLoading(false); }, []);

  return { state, loading, error, currentQuestion, currentSuggestions, step, analyzeRequest, selectSuggestion: (value) => addValue('selectedSuggestions', value), addCustomInput: (value) => addValue('customInputs', value), removeSelection: (value) => removeValue('selectedSuggestions', value), removeCustomInput: (value) => removeValue('customInputs', value), generateFinalPrompt, refinePrompt, editPrompt, resetAll };
}
