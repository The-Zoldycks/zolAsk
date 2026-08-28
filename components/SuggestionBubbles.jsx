'use client';

import styles from './SuggestionBubbles.module.css';

export default function SuggestionBubbles({
  question,
  suggestions = [],
  onSelect,
  onCustom,
  disabled = false,
}) {
  const handleCustom = () => {
    const input = prompt('Enter your custom response:');
    if (input && input.trim()) {
      onCustom(input.trim());
    }
  };

  return (
    <div className={styles.container}>
      {question && <p className={styles.question}>{question}</p>}
      
      <div className={styles.bubblesWrapper}>
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            className={styles.bubble}
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
          >
            {suggestion}
          </button>
        ))}
        
        <button
          className={styles.customBubble}
          onClick={handleCustom}
          disabled={disabled}
          title="Enter your own custom response"
        >
          + Custom
        </button>
      </div>
    </div>
  );
}
