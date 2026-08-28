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
      {question && <p className="text-lg font-semibold text-gray-900 mb-4">{question}</p>}

      <div className="flex flex-wrap gap-3">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-primary-500 hover:bg-primary-50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {suggestion}
          </button>
        ))}

        <button
          onClick={handleCustom}
          disabled={disabled}
          className="px-4 py-2 bg-blue-50 border-2 border-dashed border-blue-300 rounded-full text-sm font-medium text-blue-700 hover:border-primary-500 hover:bg-primary-50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all inline-flex items-center gap-1"
          title="Enter your own custom response"
        >
          <Plus size={16} />
          Custom
        </button>
      </div>
    </div>
  );
}
