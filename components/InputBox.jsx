'use client';

import { useState } from 'react';
import styles from './InputBox.module.css';

export default function InputBox({ onSubmit, disabled = false, placeholder = "Describe what you want to create..." }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          className={styles.button}
          disabled={disabled || !input.trim()}
        >
          {disabled ? 'Processing...' : 'Build Prompt'}
        </button>
      </div>
      <p className={styles.hint}>
        💡 Describe your idea in natural language. Be as vague or specific as you want—zolAsk will guide you from there.
      </p>
    </form>
  );
}
