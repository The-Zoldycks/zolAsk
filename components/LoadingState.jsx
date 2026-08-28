'use client';

import styles from './LoadingState.module.css';

export default function LoadingState({ message = 'Analyzing your request...' }) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
