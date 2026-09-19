import { createPromptRoute } from '@/lib/api';

export const POST = createPromptRoute({ operation: 'analyze', responseType: 'analyze' });
