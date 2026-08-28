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
    <div className="w-full my-8 bg-slate-700/40 border-2 border-slate-600 rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Your Prompt</h2>
        {summary && <p className="text-sm text-slate-400">{summary}</p>}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-4">
          <textarea
            ref={textareaRef}
            value={editedPrompt}
            onChange={(e) => setEditedPrompt(e.target.value)}
            className="w-full px-4 py-3 border-2 border-blue-400 bg-slate-700 text-slate-100 rounded-lg font-mono text-sm resize-vertical min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-slate-100 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 min-h-[120px] text-slate-200 whitespace-pre-wrap break-words leading-relaxed">
            {editedPrompt}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Edit the prompt"
            >
              <Edit2 size={16} />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={handleCopy}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                copied
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
              title="Copy to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={onRefine}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              title="Refine the prompt further"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Refine</span>
            </button>
            <button
              onClick={onStartOver}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-red-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
