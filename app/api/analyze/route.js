import { getProvider, getProviderWithFallback } from '@/lib/providers';

export async function POST(request) {
  try {
    const { userRequest } = await request.json();

    if (!userRequest || typeof userRequest !== 'string') {
      return Response.json(
        { error: 'Invalid request: userRequest is required' },
        { status: 400 }
      );
    }

    // Try with primary provider, fallback to secondary if available
    let result;
    try {
      const provider = getProvider();
      result = await provider.analyzeRequest(userRequest);
    } catch (primaryError) {
      console.warn('Primary provider failed, trying fallback:', primaryError.message);
      try {
        const { secondary } = getProviderWithFallback();
        if (!secondary) {
          throw primaryError;
        }
        result = await secondary.analyzeRequest(userRequest);
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
    console.error('Analysis error:', error);
    return Response.json(
      { 
        error: error.message || 'Failed to analyze request',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
