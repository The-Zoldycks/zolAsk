'use client';

import { useState, useRef, useEffect } from 'react';
import { copyToClipboard } from '@/lib/utils';
import styles from './PromptDisplay.module.css';

export default function PromptDisplay({
  prompt,
  summary,
  onEdit,
  onCopy,
  onRefine,
  onStartOver,
  isLoading = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setEditedPrompt(prompt);
  }, [prompt]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedPrompt.trim() !== prompt) {
      onEdit(editedPrompt.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPrompt(prompt);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(editedPrompt);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Your Prompt</h2>
        {summary && <p className={styles.summary}>{summary}</p>}
      </div>

      {isEditing ? (
        <div className={styles.editMode}>
          <textarea
            ref={textareaRef}
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className={styles.editTextarea}
            disabled={isLoading}
          />
          <div className={styles.editActions}>
            <button
              onClick={handleSave}
              className={styles.saveButton}
              disabled={isLoading}
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.viewMode}>
          <div className={styles.promptBox}>{editedPrompt}</div>
          <div className={styles.actions}>
            <button
              onClick={() => setIsEditing(true)}
              className={styles.editButton}
              disabled={isLoading}
              title="Edit the prompt"
            >
              ✏️ Edit
            </button>
            <button
              onClick={handleCopy}
              className={`${styles.copyButton} ${copied ? styles.copied : ''}`}
              disabled={isLoading}
              title="Copy to clipboard"
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
            <button
              onClick={onRefine}
              className={styles.refineButton}
              disabled={isLoading}
              title="Refine the prompt further"
            >
              ✨ Refine
            </button>
            <button
              onClick={onStartOver}
              className={styles.resetButton}
              disabled={isLoading}
              title="Start from scratch"
            >
              🔄 Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
