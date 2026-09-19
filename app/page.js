'use client';

import { Sparkles, X } from 'lucide-react';
import InputBox from '@/components/InputBox';
import SuggestionBubbles from '@/components/SuggestionBubbles';
import PromptDisplay from '@/components/PromptDisplay';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePromptBuilder } from '@/hooks/usePromptBuilder';

function Selections({ title, values, onRemove }) { if (!values.length) return null; return <><p className="section-label">{title}</p><div className="selection-list">{values.map((value) => <Badge key={value} variant="accent">{value}<button className="remove-selection" onClick={() => onRemove(value)} aria-label={`Remove ${value}`}><X size={13} /></button></Badge>)}</div></>; }

export default function Home() {
  const builder = usePromptBuilder();
  const hasDetails = builder.state.selectedSuggestions.length + builder.state.customInputs.length > 0;
  const retry = builder.step === 'input' ? builder.resetAll : builder.refinePrompt;
  return <div className="app-shell">
    <header className="site-header"><div className="header-inner"><div className="brand"><Sparkles size={20} />zolAsk</div><p className="eyebrow">Guided prompt building</p><h1 className="headline">Turn a first thought into a better prompt.</h1><p className="subhead">A focused, conversational way to add the details that make an AI response more useful.</p></div></header>
    <main className="main-content"><Card>{builder.step === 'input' && <><CardHeader><CardTitle>What are you trying to create?</CardTitle><CardDescription>Start with an idea, a task, or a problem you want to solve.</CardDescription></CardHeader><CardContent><InputBox onSubmit={builder.analyzeRequest} disabled={builder.loading} />{builder.error && <ErrorState error={builder.error} onRetry={retry} />}</CardContent></>}
      {builder.step === 'analyzing' && <LoadingState message="Understanding your idea…" />}
      {builder.step === 'suggestions' && <CardContent><div className="progress"><span style={{ width: '58%' }} /></div><p className="section-label">Your direction</p><p style={{ marginTop: 0 }}>{builder.state.goal || builder.state.originalInput}</p>{builder.state.category && <Badge variant="outline">{builder.state.category.replace('_', ' ')}</Badge>}{builder.loading ? <LoadingState message="Finding the next useful detail…" /> : <SuggestionBubbles question={builder.currentQuestion} suggestions={builder.currentSuggestions} onSelect={builder.selectSuggestion} onCustom={builder.addCustomInput} disabled={builder.loading} />}<Selections title="Selected details" values={builder.state.selectedSuggestions} onRemove={builder.removeSelection} /><Selections title="Custom details" values={builder.state.customInputs} onRemove={builder.removeCustomInput} />{builder.error && <ErrorState error={builder.error} onRetry={retry} />}<div className="prompt-actions" style={{ marginTop: '1.4rem' }}>{hasDetails && <Button onClick={builder.generateFinalPrompt} disabled={builder.loading}>Generate prompt</Button>}<Button variant="ghost" onClick={builder.resetAll} disabled={builder.loading}>Start over</Button></div></CardContent>}
      {builder.step === 'prompt' && <CardContent><div className="progress"><span style={{ width: '100%' }} /></div>{builder.loading ? <LoadingState message="Writing your prompt…" /> : <PromptDisplay prompt={builder.state.currentPrompt} summary={builder.state.summary} onEdit={builder.editPrompt} onRefine={builder.refinePrompt} onStartOver={builder.resetAll} isLoading={builder.loading} />}{builder.error && <ErrorState error={builder.error} onRetry={builder.generateFinalPrompt} />}</CardContent>}</Card></main>
    <footer className="site-footer">Built for clear thinking, not prompt-engineering jargon.</footer>
  </div>;
}
