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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-8 px-4 shadow-lg border-b border-blue-400/30">
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
            <div className="h-1 bg-slate-700 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                style={{ width: '50%' }}
              />
            </div>

            {/* Goal Display */}
            <div className="bg-slate-700/40 border-2 border-blue-400/30 rounded-lg p-4 mb-8">
              <p className="text-slate-200 mb-2">
                <strong className="text-blue-300">Goal:</strong> {state.goal || state.originalInput}
              </p>
              {state.category && (
                <p className="text-slate-200">
                  <strong className="text-blue-300">Category:</strong> {state.category}
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
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Zap size={18} />
                  {loading ? 'Generating...' : 'Generate Prompt'}
                </button>
              )}
              <button
                onClick={resetAll}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <RotateCcw size={18} />
                Start Over
              </button>
            </div>

            {/* Selected Items */}
            {state.selectedSuggestions.length > 0 && (
              <div className="bg-slate-700/40 border-2 border-green-500/30 rounded-lg p-4 mt-6">
                <p className="text-xs font-semibold text-green-300 mb-3 uppercase tracking-wide">
                  Your selections so far
                </p>
                <div className="flex flex-wrap gap-2">
                  {state.selectedSuggestions.map((suggestion, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-700 border border-green-400/40 rounded-full text-sm text-green-300 font-medium"
                    >
                      {suggestion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {state.customInputs.length > 0 && (
              <div className="bg-slate-700/40 border-2 border-amber-500/30 rounded-lg p-4 mt-4">
                <p className="text-xs font-semibold text-amber-300 mb-3 uppercase tracking-wide">
                  Your custom additions
                </p>
                <div className="flex flex-wrap gap-2">
                  {state.customInputs.map((input, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-slate-700 border border-amber-400/40 rounded-full text-sm text-amber-300 font-medium"
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
            <div className="h-1 bg-slate-700 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
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
      <footer className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm py-6 px-4 text-center text-sm text-slate-400 mt-auto">
        <p className="max-w-2xl mx-auto">
          Built to help you create better prompts faster. No prompt engineering knowledge required.
        </p>
      </footer>
    </div>
  );
}
