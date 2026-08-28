import { getProvider, getProviderWithFallback } from '@/lib/providers';

export async function POST(request) {
  try {
    const { promptState } = await request.json();

    if (!promptState || typeof promptState !== 'object') {
      return Response.json(
        { error: 'Invalid request: promptState is required' },
        { status: 400 }
      );
    }

    // Try with primary provider, fallback to secondary if available
    let result;
    try {
      const provider = getProvider();
      result = await provider.generatePrompt(promptState);
    } catch (primaryError) {
      console.warn('Primary provider failed, trying fallback:', primaryError.message);
      try {
        const { secondary } = getProviderWithFallback();
        if (!secondary) {
          throw primaryError;
        }
        result = await secondary.generatePrompt(promptState);
      } catch (fallbackError) {
        console.error('Fallback provider also failed:', fallbackError.message);
        throw primaryError;
      }
    }

    if (result.error) {
      return Response.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error('Prompt generation error:', error);
    return Response.json(
      { 
        error: error.message || 'Failed to generate prompt',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
