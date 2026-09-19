# zolAsk

zolAsk turns a rough idea into a clear, ready-to-use prompt through a short sequence of focused follow-up questions.

## Features

- Simple, keyboard-friendly interface made from local shadcn-style UI primitives.
- System-first light and dark appearance with no client-side theme flash.
- Gemini primary provider with Groq fallback, request timeouts, strict response contracts, and safe server errors.
- Input-size validation and a lightweight per-process rate limit.
- Editable, copyable prompt output and removable prompt details.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set at least one provider key in `.env.local`:

```bash
GEMINI_API_KEY=your_key
GROQ_API_KEY=your_optional_fallback_key
AI_PROVIDER=gemini
```

`GEMINI_MODEL` and `GROQ_MODEL` are optional model overrides. The configured defaults live next to the provider implementations, so configuration and documentation cannot silently drift.

## Quality checks

```bash
npm test
npm run lint
npm run build
```

The test suite covers prompt-state normalization, provider response validation, and automatic fallback. Add route and browser-flow coverage as the application grows.

## API

All routes accept JSON and return JSON:

- `POST /api/analyze` — `{ "userRequest": "…" }`
- `POST /api/suggestions` — `{ "promptState": { … } }`
- `POST /api/prompt` — `{ "promptState": { … } }`

Requests are capped at 20 per minute per client identifier in a single server process. For multi-instance production deployments, replace the in-memory limiter with a shared store such as Redis or an edge rate-limiting service.

## Architecture

- `components/ui/` contains composable shadcn-style primitives used by the interface.
- `hooks/usePromptBuilder.js` owns client flow, optimistic detail selection, rollback, and prompt editing.
- `lib/contracts.js` defines request/response contracts.
- `lib/api.js` centralizes request parsing, validation, rate limiting, fallback invocation, and safe error responses.
- `lib/providers/` contains the provider adapters.
