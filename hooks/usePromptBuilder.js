'use client';

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing zolAsk prompt state and interactions
 */
export function usePromptBuilder() {
  const [state, setState] = useState({
    originalInput: '',
    category: '',
    goal: '',
    parameters: {},
    missingParameters: [],
    selectedSuggestions: [],
    customInputs: [],
    currentPrompt: '',
    summary: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentSuggestions, setCurrentSuggestions] = useState([]);
  const [step, setStep] = useState('input'); // input, analyzing, suggestions, prompt

  /**
   * Analyze initial user request
   */
  const analyzeRequest = useCallback(async (userRequest) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRequest }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze request');
      }

      const analysis = await response.json();

      setState((prev) => ({
        ...prev,
        originalInput: userRequest,
        category: analysis.category || '',
        goal: analysis.goal || '',
        parameters: analysis.knownParameters || {},
        missingParameters: analysis.missingParameters || [],
      }));

      setCurrentQuestion(analysis.nextQuestion || 'What would you like to refine?');
      setCurrentSuggestions(analysis.suggestions || []);
      setStep('suggestions');
    } catch (err) {
      setError(err.message);
      setStep('input');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle suggestion selection
   */
  const selectSuggestion = useCallback(async (suggestion) => {
    setLoading(true);
    setError('');

    const newState = {
      ...state,
      selectedSuggestions: [...state.selectedSuggestions, suggestion],
    };
    setState(newState);

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptState: newState }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate suggestions');
      }

      const result = await response.json();
      setCurrentQuestion(result.nextQuestion || 'Any other changes?');
      setCurrentSuggestions(result.suggestions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [state]);

  /**
   * Handle custom input
   */
  const addCustomInput = useCallback(async (input) => {
    setLoading(true);
    setError('');

    const newState = {
      ...state,
      customInputs: [...state.customInputs, input],
    };
    setState(newState);

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptState: newState }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate suggestions');
      }

      const result = await response.json();
      setCurrentQuestion(result.nextQuestion || 'Any other changes?');
      setCurrentSuggestions(result.suggestions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [state]);

  /**
   * Generate final prompt
   */
  const generateFinalPrompt = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptState: state }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate prompt');
      }

      const result = await response.json();
      setState((prev) => ({
        ...prev,
        currentPrompt: result.prompt || '',
        summary: result.summary || '',
      }));

      setStep('prompt');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [state]);

  /**
   * Refine prompt further
   */
  const refinePrompt = useCallback(async () => {
    setStep('suggestions');
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptState: state }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate suggestions');
      }

      const result = await response.json();
      setCurrentQuestion(result.nextQuestion || 'Any other changes?');
      setCurrentSuggestions(result.suggestions || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [state]);

  /**
   * Edit the current prompt
   */
  const editPrompt = useCallback((newPrompt) => {
    setState((prev) => ({
      ...prev,
      currentPrompt: newPrompt,
    }));
  }, []);

  /**
   * Reset to start
   */
  const resetAll = useCallback(() => {
    setState({
      originalInput: '',
      category: '',
      goal: '',
      parameters: {},
      missingParameters: [],
      selectedSuggestions: [],
      customInputs: [],
      currentPrompt: '',
      summary: '',
    });
    setCurrentQuestion('');
    setCurrentSuggestions([]);
    setStep('input');
    setError('');
  }, []);

  return {
    state,
    loading,
    error,
    currentQuestion,
    currentSuggestions,
    step,
    analyzeRequest,
    selectSuggestion,
    addCustomInput,
    generateFinalPrompt,
    refinePrompt,
    editPrompt,
    resetAll,
  };
}
