'use client';

import { useState, useEffect } from 'react';
import InputBox from '@/components/InputBox';
import SuggestionBubbles from '@/components/SuggestionBubbles';
import PromptDisplay from '@/components/PromptDisplay';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { usePromptBuilder } from '@/hooks/usePromptBuilder';
import styles from './page.module.css';

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

  // Show "Generate Prompt" button after sufficient selections
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
    <main className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>✨ zolAsk</h1>
          <p className={styles.subtitle}>
            Transform your rough ideas into polished, structured prompts
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className={styles.content}>
        {/* Step 1: Initial Input */}
        {step === 'input' && (
          <section className={styles.section}>
            <InputBox
              onSubmit={analyzeRequest}
              disabled={loading}
              placeholder="Describe what you want to create..."
            />
            {error && (
              <ErrorState
                error={error}
                onRetry={() => {
                  // Reset and try again
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
          <section className={styles.section}>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: '50%' }} />
            </div>

            <div className={styles.goalDisplay}>
              <p>
                <strong>Goal:</strong> {state.goal || state.originalInput}
              </p>
              {state.category && (
                <p>
                  <strong>Category:</strong> {state.category}
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
              <ErrorState
                error={error}
                onRetry={() => refinePrompt()}
              />
            )}

            <div className={styles.actionButtons}>
              {showFinalPromptButton && (
                <button
                  onClick={handleGeneratePrompt}
                  className={styles.generateButton}
                  disabled={loading}
                >
                  {loading ? '⏳ Generating...' : '🎯 Generate Prompt'}
                </button>
              )}
              <button
                onClick={resetAll}
                className={styles.resetButton}
                disabled={loading}
              >
                🔄 Start Over
              </button>
            </div>

            {state.selectedSuggestions.length > 0 && (
              <div className={styles.selectedBox}>
                <p className={styles.selectedLabel}>Your selections so far:</p>
                <div className={styles.selectedItems}>
                  {state.selectedSuggestions.map((suggestion, idx) => (
                    <span key={idx} className={styles.selectedItem}>
                      {suggestion}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {state.customInputs.length > 0 && (
              <div className={styles.selectedBox}>
                <p className={styles.selectedLabel}>Your custom additions:</p>
                <div className={styles.selectedItems}>
                  {state.customInputs.map((input, idx) => (
                    <span key={idx} className={styles.selectedItem}>
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
          <section className={styles.section}>
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: '100%' }} />
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
              <ErrorState
                error={error}
                onRetry={() => handleGeneratePrompt()}
              />
            )}
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>
          Built to help you create better prompts faster. No prompt engineering knowledge required.
        </p>
      </footer>
    </main>
  );
}
