# 🚀 zolAsk - Quick Start Guide

## ⚡ 30-Second Setup

### Step 1: Get API Keys
- **Gemini** (Primary): Visit https://ai.google.dev/ and generate an API key
- **Groq** (Optional Fallback): Visit https://console.groq.com/ and generate a key

### Step 2: Configure Environment
Edit `.env.local`:
```
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
AI_PROVIDER=gemini
```

### Step 3: Start the App
```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📁 Project Structure Overview

```
zolAsk/
├── app/api/                    # Backend API routes
│   ├── analyze/route.js        # 1️⃣ Analyze requests
│   ├── suggestions/route.js    # 2️⃣ Generate suggestions
│   └── prompt/route.js         # 3️⃣ Create final prompt
├── components/                 # React UI components
│   ├── InputBox.jsx            # User input form
│   ├── SuggestionBubbles.jsx   # Clickable suggestions
│   ├── PromptDisplay.jsx       # Final prompt display
│   ├── LoadingState.jsx        # Loading spinner
│   └── ErrorState.jsx          # Error messages
├── hooks/
│   └── usePromptBuilder.js     # State management
├── lib/
│   ├── providers/              # AI provider implementations
│   │   ├── base.js             # Abstract base class
│   │   ├── gemini.js           # Google Gemini
│   │   ├── groq.js             # Groq (fallback)
│   │   └── index.js            # Provider selector
│   └── utils.js                # Helper functions
└── app/
    ├── layout.js               # Next.js layout
    ├── page.js                 # Main page
    └── globals.css             # Global styles
```

---

## 🎯 User Flow

1. **User enters rough idea** → "I want an image of a cyberpunk city"
2. **App analyzes** → Identifies category, suggests improvements
3. **User selects** → Chooses suggestions or adds custom text
4. **App suggests more** → Context-aware follow-up questions
5. **User clicks "Generate"** → Gets polished, structured prompt
6. **User refines** → Can edit, copy, or get more suggestions

---

## 🔄 How Providers Work

```
Primary (Gemini)
    ↓
    If success → Use response
    If failure → Try Groq (fallback)
              ↓
              If success → Use response
              If failure → Show error
```

Switch providers by changing `.env.local`:
```
AI_PROVIDER=groq    # Use Groq instead
AI_PROVIDER=gemini  # Use Gemini (default)
```

---

## 📝 API Endpoints

### `POST /api/analyze`
**Input:** `{ "userRequest": "..." }`
**Output:** `{ "category", "goal", "suggestions": [...] }`

### `POST /api/suggestions`
**Input:** `{ "promptState": {...} }`
**Output:** `{ "nextQuestion", "suggestions": [...] }`

### `POST /api/prompt`
**Input:** `{ "promptState": {...} }`
**Output:** `{ "prompt": "...", "summary": "..." }`

---

## 🛠 Available Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Run production server
npm run lint      # Check code quality
```

---

## ⚙️ Configuration Options

### Environment Variables
```
GEMINI_API_KEY     # Required for Gemini provider
GROQ_API_KEY       # Required for Groq provider
AI_PROVIDER        # "gemini" (default) or "groq"
NODE_ENV           # "development" or "production"
```

### Component Props

**InputBox**
- `onSubmit` - Callback when user submits
- `disabled` - Disable during processing
- `placeholder` - Input placeholder text

**SuggestionBubbles**
- `question` - Current question to display
- `suggestions` - Array of suggestion strings
- `onSelect` - Callback when suggestion clicked
- `onCustom` - Callback for custom input
- `disabled` - Disable during processing

**PromptDisplay**
- `prompt` - The prompt text to display
- `summary` - Brief description
- `onEdit` - Called when prompt edited
- `onRefine` - Called when refine clicked
- `onStartOver` - Called when reset clicked
- `isLoading` - Show loading state

---

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| `GEMINI_API_KEY not set` | Add key to `.env.local` and restart |
| API returns error | Check API key is valid, try other provider |
| Slow responses | Try Groq: set `AI_PROVIDER=groq` |
| Suggestions not appearing | Make at least one selection first |
| Styling looks broken | Run `npm install` to get all dependencies |

---

## 📚 Learn More

- Full documentation: [README.md](./README.md)
- Provider classes: [lib/providers/](./lib/providers/)
- Components: [components/](./components/)
- State hook: [hooks/usePromptBuilder.js](./hooks/usePromptBuilder.js)

---

## ✨ Key Features

✅ Dynamic suggestion generation  
✅ Structured prompt state (not chat-like)  
✅ Fallback provider support  
✅ Editable final prompts  
✅ Responsive mobile design  
✅ Graceful error handling  
✅ Environment variable configuration  
✅ Provider abstraction for extensibility  

---

## 🎓 What Makes zolAsk Different

Instead of asking users to understand "prompt engineering," zolAsk:
- Asks intelligent, contextual questions
- Shows relevant suggestion buttons
- Builds prompts progressively
- Lets users edit the final result
- Never requires technical knowledge

**Result**: Better prompts, faster. No expertise needed.

---

Happy prompt building! 🚀
