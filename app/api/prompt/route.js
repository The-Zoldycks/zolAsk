import { createPromptRoute } from '@/lib/api';

export const POST = createPromptRoute({ operation: 'prompt', responseType: 'prompt' });
