'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SuggestionBubbles({ question, suggestions, onSelect, onCustom, disabled }) {
  const [customValue, setCustomValue] = useState('');
  function addCustom(event) { event.preventDefault(); if (customValue.trim()) { onCustom(customValue.trim()); setCustomValue(''); } }
  return <div>
    <h2 className="card-title">{question || 'What would you like to refine?'}</h2>
    <p className="card-description">Choose an option or add a detail in your own words.</p>
    <div className="suggestion-list" style={{ marginTop: '1.1rem' }}>{suggestions.map((suggestion) => <button className="suggestion" key={suggestion} onClick={() => onSelect(suggestion)} disabled={disabled}>{suggestion}</button>)}</div>
    <form className="custom-entry" onSubmit={addCustom}><Input value={customValue} maxLength={240} onChange={(event) => setCustomValue(event.target.value)} disabled={disabled} placeholder="Add a custom detail" aria-label="Custom prompt detail" /><Button variant="outline" type="submit" disabled={disabled || !customValue.trim()}><Plus size={16} />Add</Button></form>
  </div>;
}
