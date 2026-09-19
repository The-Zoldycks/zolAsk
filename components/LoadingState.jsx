'use client';
export default function LoadingState({ message = 'Working…' }) { return <div className="loading" role="status" aria-live="polite"><span className="spinner" /><span>{message}</span></div>; }
