'use client';

import { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function InputBox({ onSubmit, disabled }) {
  const [input, setInput] = useState('');
  function submit(event) { event.preventDefault(); if (input.trim() && !disabled) onSubmit(input.trim()); }
  return <form onSubmit={submit}>
    <Textarea aria-label="Describe your idea" value={input} onChange={(event) => setInput(event.target.value)} disabled={disabled} placeholder="Describe what you want to create…" />
    <div className="form-actions"><span className="hint">Be as rough or specific as you like. We’ll help shape it.</span><Button type="submit" disabled={disabled || !input.trim()}><ArrowUp size={16} />Build prompt</Button></div>
  </form>;
}
