'use client';

import { Plus } from 'lucide-react';

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
    <div className="w-full my-8">
      {question && <p className="text-xl font-semibold text-white mb-4">{question}</p>}

      <div className="flex flex-wrap gap-3">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
            className="px-4 py-2 bg-slate-700 border-2 border-slate-600 rounded-full text-sm font-medium text-slate-100 hover:bg-slate-600 hover:border-blue-400 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {suggestion}
          </button>
        ))}

        <button
          onClick={handleCustom}
          disabled={disabled}
          className="px-4 py-2 bg-slate-700 border-2 border-dashed border-blue-400 rounded-full text-sm font-medium text-blue-300 hover:bg-slate-600 hover:border-blue-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1"
          title="Enter your own custom response"
        >
          <Plus size={16} />
          Custom
        </button>
      </div>
    </div>
  );
}
