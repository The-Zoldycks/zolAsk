'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function InputBox({
  onSubmit,
  disabled = false,
  placeholder = 'Describe what you want to create...',
}) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-4">
        <div className="flex gap-3">
          <textarea
            className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-vertical min-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="self-end px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-blue-600 transition-all duration-200"
            disabled={disabled || !input.trim()}
          >
            <Send size={18} />
            <span className="hidden sm:inline">Build</span>
          </button>
        </div>
        <p className="text-sm text-slate-400">
          Describe your idea in natural language. zolAsk will guide you from there.
        </p>
      </div>
    </form>
  );
}
