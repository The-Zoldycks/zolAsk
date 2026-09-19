'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Pencil, RefreshCw, RotateCcw, Save } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function PromptDisplay({ prompt, summary, onEdit, onRefine, onStartOver, isLoading }) {
  const [editing, setEditing] = useState(false); const [value, setValue] = useState(prompt); const [copied, setCopied] = useState(false); const inputRef = useRef(null);
  useEffect(() => setValue(prompt), [prompt]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);
  async function copy() { if (await copyToClipboard(value)) { setCopied(true); setTimeout(() => setCopied(false), 1800); } }
  return <div>
    <div className="card-header" style={{ padding: 0 }}><h2 className="card-title">Your prompt</h2>{summary && <p className="card-description">{summary}</p>}</div>
    <div style={{ marginTop: '1rem' }}>{editing ? <Textarea ref={inputRef} value={value} onChange={(event) => setValue(event.target.value)} disabled={isLoading} /> : <pre className="prompt-output">{value}</pre>}</div>
    <div className="prompt-actions" style={{ marginTop: '1rem' }}>{editing ? <><Button onClick={() => { onEdit(value.trim()); setEditing(false); }} disabled={isLoading || !value.trim()}><Save size={16} />Save</Button><Button variant="outline" onClick={() => { setValue(prompt); setEditing(false); }} disabled={isLoading}>Cancel</Button></> : <><Button variant="outline" onClick={() => setEditing(true)} disabled={isLoading}><Pencil size={16} />Edit</Button><Button variant="outline" onClick={copy} disabled={isLoading}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</Button><Button variant="outline" onClick={onRefine} disabled={isLoading}><RefreshCw size={16} />Refine</Button><Button variant="ghost" onClick={onStartOver} disabled={isLoading}><RotateCcw size={16} />Start over</Button></>}</div>
  </div>;
}
