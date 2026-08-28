'use client';

export default function LoadingState({ message = 'Analyzing your request...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-400 rounded-full animate-spin" />
      <p className="text-base text-slate-400 text-center">{message}</p>
    </div>
  );
}
