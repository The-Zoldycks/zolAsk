'use client';
import { AlertCircle } from 'lucide-react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
export default function ErrorState({ error, onRetry }) { return <Alert><div style={{ display: 'flex', gap: '.65rem', alignItems: 'start' }}><AlertCircle size={18} /><div><p className="alert-title">We couldn’t complete that.</p><p className="alert-message">{error || 'Please try again.'}</p>{onRetry && <Button variant="outline" onClick={onRetry}>Try again</Button>}</div></div></Alert>; }
