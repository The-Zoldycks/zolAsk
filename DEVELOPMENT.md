# zolAsk Development Guide

## Architecture Overview

zolAsk follows a **progressive prompt-building pattern** where each step refines the user's initial idea.

```
                    ┌─────────────────────┐
                    │   User Input Box    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  /api/analyze       │ ← AI analyzes request
                    │  (Gemini/Groq)      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Suggestion Bubbles  │ ← User selects options
                    │ (User Interacts)    │
                    └──────────┬──────────┘
                               │
                      ┌────────┴────────┐
                      │                 │
                      ▼                 ▼
              ┌──────────────┐   ┌─────────────────┐
              │ /api/         │   │ Suggestion      │
              │ suggestions   │   │ selected, loop  │
              │ (Refine)      │   │ or generate     │
              └──────────────┘   └─────────────────┘
                      │                 │
                      └────────┬────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  /api/prompt        │ ← AI generates final
                    │  (Generate Final)   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Prompt Display      │ ← User can:
                    │ (Edit/Copy/Refine)  │   • Edit
                    └─────────────────────┘   • Copy
                                             • Refine
                                             • Start over
```

---

## Component Communication Flow

```
┌────────────────────────────────────────────┐
│         page.js (Main Container)           │
│    ┌──────────────────────────────────┐    │
│    │  usePromptBuilder() Hook         │    │
│    │  (State Management)              │    │
│    └──────────────────────────────────┘    │
└────────────────┬───────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    InputBox          SuggestionBubbles
    (User Input)      (Interactions)
        │                 │
        └────────┬────────┘
                 │
                 ▼
        PromptDisplay
        (Final Result)
        │
        └─ onEdit → updateState
        └─ onRefine → callAPI
        └─ onCopy → clipboard
        └─ onStartOver → reset
```

---

## State Structure

```javascript
{
  originalInput: string,           // User's initial request
  category: string,                // Type: image_generation, coding, etc.
  goal: string,                    // What user is trying to accomplish
  
  parameters: {
    [key: string]: string          // Collected parameters
  },
  
  missingParameters: string[],     // Suggested missing info
  selectedSuggestions: string[],   // User's selected suggestions
  customInputs: string[],          // User's custom text additions
  
  currentPrompt: string,           // Final generated prompt
  summary: string                  // Brief description
}
```

---

## API Response Contracts

### Analyze Response
```javascript
{
  "category": "image_generation" | "writing" | "coding" | ...,
  "goal": "User's objective",
  "knownParameters": { key: value },
  "missingParameters": ["param1", "param2"],
  "nextQuestion": "What style?",
  "suggestions": ["Option1", "Option2", "Option3"]
}
```

### Suggestions Response
```javascript
{
  "nextQuestion": "Next question to ask",
  "suggestions": ["Suggestion1", "Suggestion2", ...]
}
```

### Prompt Response
```javascript
{
  "prompt": "Full polished prompt text",
  "summary": "Brief description of prompt"
}
```

---

## Adding a New AI Provider

### 1. Create Provider Class

```javascript
// lib/providers/custom.js
import { BaseProvider } from './base.js';

export class CustomProvider extends BaseProvider {
  constructor(apiKey) {
    super(apiKey);
    this.apiUrl = 'https://api.example.com/v1/complete';
  }

  async analyzeRequest(userRequest) {
    // Implementation
    // Must return: { category, goal, suggestions, nextQuestion, ... }
  }

  async generateSuggestions(promptState) {
    // Implementation
    // Must return: { nextQuestion, suggestions }
  }

  async generatePrompt(promptState) {
    // Implementation
    // Must return: { prompt, summary }
  }
}
```

### 2. Register in Factory

```javascript
// lib/providers/index.js
import { CustomProvider } from './custom.js';

export function getProvider(preferredProvider = null) {
  const provider = preferredProvider || process.env.AI_PROVIDER || 'gemini';

  if (provider === 'custom') {
    const key = process.env.CUSTOM_API_KEY;
    if (!key) throw new Error('CUSTOM_API_KEY not set');
    return new CustomProvider(key);
  }
  
  // ... existing providers
}
```

### 3. Add Environment Variable

```
# .env.example
CUSTOM_API_KEY=your_key_here
```

---

## Creating Custom Components

### Basic Component Template

```javascript
// components/MyComponent.jsx
'use client';

import styles from './MyComponent.module.css';

export default function MyComponent({ 
  prop1,
  prop2,
  onAction 
}) {
  return (
    <div className={styles.container}>
      {/* Component content */}
    </div>
  );
}
```

### Styling with CSS Modules

```css
/* components/MyComponent.module.css */
.container {
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
}

.container:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
```

### Using in Main Page

```javascript
// app/page.js
import MyComponent from '@/components/MyComponent';

export default function Home() {
  return (
    <MyComponent 
      prop1="value"
      onAction={() => console.log('Action')}
    />
  );
}
```

---

## Extending the Hook

```javascript
// hooks/usePromptBuilder.js
export function usePromptBuilder() {
  // ... existing code ...
  
  // Add new method
  const addCustomMethod = useCallback(async (data) => {
    // Implementation
  }, [state]);
  
  return {
    // ... existing returns ...
    addCustomMethod
  };
}
```

Usage in component:
```javascript
const { addCustomMethod } = usePromptBuilder();
addCustomMethod(data);
```

---

## API Route Structure

All API routes follow this pattern:

```javascript
// app/api/endpoint/route.js
'use client';

import { getProvider, getProviderWithFallback } from '@/lib/providers';

export async function POST(request) {
  try {
    const { data } = await request.json();
    
    // Validate input
    if (!data) {
      return Response.json(
        { error: 'Invalid input' },
        { status: 400 }
      );
    }

    // Try primary provider, fallback to secondary
    let result;
    try {
      const provider = getProvider();
      result = await provider.method(data);
    } catch (primaryError) {
      const { secondary } = getProviderWithFallback();
      if (!secondary) throw primaryError;
      result = await secondary.method(data);
    }

    if (result.error) {
      return Response.json({ error: result.error }, { status: 500 });
    }

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Error Handling Patterns

### Client-Side (Component)

```javascript
const [error, setError] = useState('');

const handleAction = async () => {
  try {
    setError('');
    const result = await fetch('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (!result.ok) {
      const err = await result.json();
      throw new Error(err.error);
    }
    
    const data = await result.json();
    // Handle success
  } catch (err) {
    setError(err.message);
  }
};

// Show error
{error && <ErrorState error={error} onRetry={handleAction} />}
```

### Server-Side (API Route)

```javascript
try {
  // Validate input
  if (!inputData) {
    return Response.json(
      { error: 'Missing required field' },
      { status: 400 }
    );
  }

  // Process request
  const result = await provider.method(inputData);

  // Validate output
  if (!result || result.error) {
    return Response.json(
      { error: 'Processing failed' },
      { status: 500 }
    );
  }

  return Response.json(result);
} catch (error) {
  console.error('Error:', error);
  return Response.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

---

## Testing Tips

### Testing Components
```javascript
// Render with props
<InputBox onSubmit={jest.fn()} disabled={false} />

// Simulate user interaction
fireEvent.click(button);
userEvent.type(input, 'text');
```

### Testing API Routes
```javascript
const response = await fetch('/api/analyze', {
  method: 'POST',
  body: JSON.stringify({ userRequest: 'test' })
});
expect(response.status).toBe(200);
const data = await response.json();
expect(data.category).toBeDefined();
```

### Testing Hooks
```javascript
const { result } = renderHook(() => usePromptBuilder());

act(() => {
  result.current.analyzeRequest('test request');
});

expect(result.current.state.originalInput).toBe('test request');
```

---

## Performance Optimization

### Code Splitting
```javascript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <LoadingState />
});
```

### Memoization
```javascript
// Prevent unnecessary re-renders
const MemoComponent = React.memo(MyComponent);

// Memoize callbacks
const handleClick = useCallback(() => { ... }, [dependency]);
```

### Debouncing
```javascript
// Prevent excessive API calls
const debouncedSearch = debounce(async (text) => {
  const results = await fetch('/api/suggestions', { ... });
}, 300);
```

---

## Debugging

### Browser Console
```javascript
// Log state changes
console.log('Current state:', state);

// Check API responses
console.log('API Response:', await response.json());
```

### Environment
```javascript
// Check active provider
console.log('Provider:', process.env.AI_PROVIDER);

// Check key availability
console.log('Has Gemini key:', !!process.env.GEMINI_API_KEY);
```

### React DevTools
- Inspect component props
- Trace re-renders
- Monitor hook state
- Check performance

---

## Best Practices

1. **Always validate input** - User and API responses
2. **Handle errors gracefully** - Show helpful messages
3. **Use loading states** - Indicate processing
4. **Fallback to secondary provider** - Don't fail if primary is down
5. **Keep components focused** - Single responsibility
6. **Centralize state** - Use hook for management
7. **Modularize providers** - Easy to extend
8. **Test edge cases** - Empty, invalid, large inputs
9. **Optimize performance** - Debounce, memoize, lazy load
10. **Document code** - Comments for complex logic

---

## Common Tasks

### Changing the Default Provider
```javascript
// .env.local
AI_PROVIDER=groq
```

### Adding a New Suggestion Type
1. Update AI prompt in provider
2. Add to response validation
3. Update UI component
4. Test with different requests

### Customizing Styling
- Each component has `Component.module.css`
- Edit CSS files directly
- Follow existing color scheme
- Keep responsive design in mind

### Adding Analytics
1. Create `lib/analytics.js`
2. Call tracking functions in components
3. Send events to analytics service
4. Build dashboard

---

This guide should help you understand and extend zolAsk! Happy coding! 🚀
