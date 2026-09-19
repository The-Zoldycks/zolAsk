import { createPromptRoute } from '@/lib/api';

export const POST = createPromptRoute({ operation: 'suggestions', responseType: 'suggestions' });
