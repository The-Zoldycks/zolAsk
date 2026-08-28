'use client';

import { useState, useRef, useEffect } from 'react';
import { Copy, Edit2, RefreshCw, RotateCcw, Check } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';

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
    <div className="w-full my-8 bg-white border-2 border-gray-200 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Prompt</h2>
        {summary && <p className="text-sm text-gray-600">{summary}</p>}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-4">
          <textarea
            ref={textareaRef}
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full px-4 py-3 border-2 border-primary-500 rounded-lg font-mono text-sm resize-vertical min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:text-gray-500"
            disabled={isLoading}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[120px] text-gray-900 whitespace-pre-wrap break-words">
            {editedPrompt}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              title="Edit the prompt"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed ${
                copied
                  ? 'bg-accent-500 text-white'
                  : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
              }`}
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={onRefine}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all col-span-1"
              title="Refine the prompt further"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Refine</span>
            </button>
            <button
              onClick={onStartOver}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all col-span-1"
              title="Start from scratch"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
