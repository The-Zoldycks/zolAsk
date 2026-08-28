'use client';

import styles from './ErrorState.module.css';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <h3 className={styles.title}>Something went wrong</h3>
      <p className={styles.message}>{error || 'An unexpected error occurred. Please try again.'}</p>
      {onRetry && (
        <button onClick={onRetry} className={styles.retryButton}>
          Try Again
        </button>
      )}
    </div>
  );
}
