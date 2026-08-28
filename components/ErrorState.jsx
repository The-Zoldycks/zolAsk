'use client';

import { AlertCircle } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  return (
    <div className="bg-red-900/20 border-2 border-red-600 rounded-lg p-6 text-center my-8">
      <div className="flex justify-center mb-4">
        <AlertCircle size={48} className="text-red-400" />
      </div>
      <h3 className="text-xl font-bold text-red-300 mb-2">Something went wrong</h3>
      <p className="text-red-200 mb-4 leading-relaxed">
        {error || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
