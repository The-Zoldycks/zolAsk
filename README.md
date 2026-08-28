# zolAsk — Prompt Builder Setup & Configuration

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure API Keys

Copy `.env.example` to `.env.local` and add your API keys:

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
AI_PROVIDER=gemini  # optional: defaults to gemini
```

**Get your API keys:**
- **Gemini**: https://ai.google.dev/
- **Groq**: https://console.groq.com/

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
zolAsk/
├── app/
│   ├── api/
│   │   ├── analyze/route.js        # Analyze user requests
│   │   ├── suggestions/route.js    # Generate suggestions
│   │   └── prompt/route.js         # Generate final prompts
│   ├── globals.css
│   ├── layout.js
│   └── page.js                     # Main application
├── components/
│   ├── InputBox.jsx                # Initial input form
│   ├── SuggestionBubbles.jsx       # Suggestion UI
│   ├── PromptDisplay.jsx           # Final prompt display
│   ├── LoadingState.jsx            # Loading indicator
│   └── ErrorState.jsx              # Error handling
├── hooks/
│   └── usePromptBuilder.js         # State management hook
├── lib/
│   ├── providers/
│   │   ├── base.js                 # Base provider class
│   │   ├── gemini.js               # Gemini provider
│   │   ├── groq.js                 # Groq provider
│   │   └── index.js                # Provider factory
│   └── utils.js                    # Utility functions
├── .env.local                      # Environment variables (not in git)
├── .env.example                    # Example env file
└── package.json
```

---

## How It Works

### 1. **Initial Input** 
User enters a rough idea. The app sends it to the AI for analysis.

### 2. **Request Analysis**
The AI categorizes the request, identifies known parameters, and suggests improvements.

### 3. **Suggestion Bubbles**
User selects suggestions or enters custom input. The app generates more suggestions based on selections.

### 4. **Prompt Generation**
When ready, the AI creates a polished final prompt incorporating all selections.

### 5. **Editing & Refinement**
User can edit the prompt, copy it, refine further, or start over.

---

## API Routes

### `POST /api/analyze`
Analyzes the initial user request.

**Request:**
```json
{
  "userRequest": "I want an image of a cyberpunk city"
}
```

**Response:**
```json
{
  "category": "image_generation",
  "goal": "Create a cyberpunk city image",
  "knownParameters": { "type": "city", "style": "cyberpunk" },
  "missingParameters": ["composition", "lighting", "mood"],
  "nextQuestion": "What style should it have?",
  "suggestions": ["Realistic", "Anime", "Cinematic", "3D"]
}
```

### `POST /api/suggestions`
Generates suggestions based on current state.

**Request:**
```json
{
  "promptState": { /* current state */ }
}
```

**Response:**
```json
{
  "nextQuestion": "What's the atmosphere?",
  "suggestions": ["Dark", "Neon", "Rainy", "Futuristic"]
}
```

### `POST /api/prompt`
Generates the final polished prompt.

**Request:**
```json
{
  "promptState": { /* current state */ }
}
```

**Response:**
```json
{
  "prompt": "Create a cyberpunk city image with...",
  "summary": "Futuristic urban scene with neon lighting"
}
```

---

## Provider Configuration

### Primary Provider (Gemini)
- **Model**: `gemini-2.0-flash`
- **Speed**: Fast
- **Cost**: Free tier available
- **API Key**: Set `GEMINI_API_KEY` in `.env.local`

### Fallback Provider (Groq)
- **Model**: `mixtral-8x7b-32768`
- **Speed**: Very fast
- **Cost**: Free tier available
- **API Key**: Set `GROQ_API_KEY` in `.env.local`

The app automatically uses Gemini by default. To use Groq:
```
AI_PROVIDER=groq
```

If the primary provider fails, the app attempts to use the fallback automatically.

---

## Component Details

### `InputBox`
- Text input for initial request
- Disabled state during processing
- Keyboard shortcut: Ctrl+Enter to submit

### `SuggestionBubbles`
- Displays current question
- Shows 3-6 suggestion buttons
- Includes "Custom" button for free text
- Context-aware and responsive

### `PromptDisplay`
- Shows generated prompt
- Edit mode for manual modifications
- Copy to clipboard
- Refine for more suggestions
- Start over button

### `usePromptBuilder` Hook
Manages state and API interactions:
- `analyzeRequest(userRequest)` - Analyze initial input
- `selectSuggestion(suggestion)` - Handle suggestion selection
- `addCustomInput(input)` - Handle custom text
- `generateFinalPrompt()` - Create final prompt
- `refinePrompt()` - Get more suggestions
- `editPrompt(newText)` - Update prompt manually
- `resetAll()` - Start over

---

## Error Handling

The app includes graceful error handling:
- **API Errors**: Shows error message with retry button
- **Parsing Errors**: Validates AI responses and handles malformed JSON
- **Network Errors**: Automatic fallback to secondary provider
- **Missing Keys**: Clear error messages at startup

---

## Environment Variables

Create `.env.local` with:

```
# Required: At least one API key
GEMINI_API_KEY=<your_key>
GROQ_API_KEY=<your_key>

# Optional: Default is "gemini"
AI_PROVIDER=gemini
```

**Never commit `.env.local` to version control.**

---

## Development

### Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Adding a New Provider

1. Create `lib/providers/newprovider.js`:
```javascript
import { BaseProvider } from './base.js';

export class NewProvider extends BaseProvider {
  async analyzeRequest(userRequest) { /* ... */ }
  async generateSuggestions(promptState) { /* ... */ }
  async generatePrompt(promptState) { /* ... */ }
}
```

2. Update `lib/providers/index.js` to include it

3. Update `.env.example` with new API key

---

## Best Practices

- **API Keys**: Never commit keys to git; use `.env.local`
- **Error Messages**: User-friendly, not technical jargon
- **Response Validation**: All AI responses are validated before use
- **Fallback Handling**: App gracefully degrades with secondary provider
- **State Management**: Centralized in `usePromptBuilder` hook
- **Modular Components**: Each component has single responsibility
- **Responsive Design**: Works on desktop and mobile

---

## Troubleshooting

### "GEMINI_API_KEY not set"
- Check `.env.local` exists
- Verify key is not empty
- Restart dev server after changing env vars

### API returns malformed JSON
- App validates and shows error
- Click "Try Again" to retry
- Check provider API status

### Suggestions not appearing
- Ensure at least one selection was made
- Check browser console for errors
- Verify API key is valid

### Slow responses
- Gemini model may be throttled; use Groq by setting `AI_PROVIDER=groq`
- Check network connection
- Check API provider status page

---

## Future Enhancements

- User authentication & history
- Saved prompt templates
- Prompt sharing/collaboration
- Custom AI providers
- Batch prompt generation
- Integration with AI services
- Prompt version control
- Analytics and usage stats

---

## License

MIT