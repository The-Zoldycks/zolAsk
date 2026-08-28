'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Zap, RotateCcw } from 'lucide-react';
import InputBox from '@/components/InputBox';
import SuggestionBubbles from '@/components/SuggestionBubbles';
import PromptDisplay from '@/components/PromptDisplay';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { usePromptBuilder } from '@/hooks/usePromptBuilder';

export default function Home() {
  const {
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
  } = usePromptBuilder();

  const [showFinalPromptButton, setShowFinalPromptButton] = useState(false);

  useEffect(() => {
    const totalInputs =
      (state.selectedSuggestions?.length || 0) + (state.customInputs?.length || 0);
    setShowFinalPromptButton(totalInputs > 0);
  }, [state.selectedSuggestions, state.customInputs]);

  const handleRefine = async () => {
    await refinePrompt();
  };

  const handleGeneratePrompt = async () => {
    await generateFinalPrompt();
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      {/* Header */}
      <header className="bg-gradient-primary text-white py-8 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Sparkles size={32} />
            <h1 className="text-4xl font-bold tracking-tight">zolAsk</h1>
          </div>
          <p className="text-lg text-blue-100">
            Transform your rough ideas into polished, structured prompts
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Step 1: Initial Input */}
        {step === 'input' && (
          <section>
            <InputBox
              onSubmit={analyzeRequest}
              disabled={loading}
              placeholder="Describe what you want to create..."
            />
            {error && (
              <ErrorState
                error={error}
                onRetry={() => {
                  resetAll();
                }}
              />
            )}
          </section>
        )}

        {/* Step 2: Analyzing */}
        {step === 'analyzing' && <LoadingState message="Analyzing your request..." />}

        {/* Step 3: Suggestions */}
        {step === 'suggestions' && (
          <section>
            {/* Progress Bar */}
            <div className="h-1 bg-gray-300 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-300"
                style={{ width: '50%' }}
              />
            </div>

            {/* Goal Display */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-gray-900 mb-2">
                <strong className="text-primary-700">Goal:</strong> {state.goal || state.originalInput}
              </p>
              {state.category && (
                <p className="text-gray-900">
                  <strong className="text-primary-700">Category:</strong> {state.category}
                </p>
              )}
            </div>

            {loading ? (
              <LoadingState message="Generating suggestions..." />
            ) : (
              <SuggestionBubbles
                question={currentQuestion}
                suggestions={currentSuggestions}
                onSelect={selectSuggestion}
                onCustom={addCustomInput}
                disabled={loading}
              />
            )}

            {error && (
              <ErrorState error={error} onRetry={() => refinePrompt()} />
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-8 flex-wrap">
              {showFinalPromptButton && (
                <button
                  onClick={handleGeneratePrompt}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-accent text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 transition-all"
                >
                  <Zap size={18} />
                  {loading ? 'Generating...' : 'Generate Prompt'}
                </button>
              )}
              <button
                onClick={resetAll}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                <RotateCcw size={18} />
                Start Over
              </button>
            </div>

            {/* Selected Items */}
            {state.selectedSuggestions.length > 0 && (
              <div className="bg-accent-50 border-2 border-accent-200 rounded-lg p-4 mt-6">
                <p className="text-sm font-semibold text-accent-700 mb-3 uppercase tracking-wide">
                  Your selections so far
                </p>
                <div className="flex flex-wrap gap-2">
                  {state.selectedSuggestions.map((suggestion, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-accent-300 rounded-full text-sm text-accent-900 font-medium"
                    >
                      {suggestion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {state.customInputs.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-sm font-semibold text-amber-700 mb-3 uppercase tracking-wide">
                  Your custom additions
                </p>
                <div className="flex flex-wrap gap-2">
                  {state.customInputs.map((input, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white border border-amber-300 rounded-full text-sm text-amber-900 font-medium"
                    >
                      {input}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Step 4: Final Prompt */}
        {step === 'prompt' && (
          <section>
            {/* Progress Bar */}
            <div className="h-1 bg-gray-300 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-300"
                style={{ width: '100%' }}
              />
            </div>

            {loading ? (
              <LoadingState message="Generating your prompt..." />
            ) : (
              <PromptDisplay
                prompt={state.currentPrompt}
                summary={state.summary}
                onEdit={editPrompt}
                onRefine={handleRefine}
                onStartOver={resetAll}
                isLoading={loading}
              />
            )}

            {error && (
              <ErrorState error={error} onRetry={() => handleGeneratePrompt()} />
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-white/50 backdrop-blur-sm py-6 px-4 text-center text-sm text-gray-600 mt-auto">
        <p className="max-w-2xl mx-auto">
          Built to help you create better prompts faster. No prompt engineering knowledge required.
        </p>
      </footer>
    </div>
  );
}
