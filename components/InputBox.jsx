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
    <form onSubmit={handleSubmit} className="w-full my-8">
      <div className="flex gap-3 mb-3">
        <textarea
          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg font-sans text-base resize-vertical min-h-[120px] focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:bg-gray-100 disabled:text-gray-500 transition-all"
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
          disabled={disabled || !input.trim()}
          className="h-full px-6 py-3 bg-gradient-primary text-white rounded-lg font-semibold cursor-pointer hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Send size={18} />
          <span className="hidden sm:inline">Build</span>
        </button>
      </div>
      <p className="text-sm text-gray-600 m-0">
        Describe your idea in natural language. Be as vague or specific as you want—zolAsk will guide you from there.
      </p>
    </form>
  );
}
