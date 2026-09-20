# PathForge — Industry-Ready Student Platform

Analyzes a student's skills, projects, resume and GitHub, then generates a personalized career roadmap, skill-gap analysis, project ideas, a 30-day plan and an AI mentor chat.

## Run locally
1. Install Node.js 18+ (`node -v` to check).
2. In this folder:
   ```bash
   npm install
   cp .env.example .env      # Windows: copy .env.example .env
   ```
3. Edit `.env` and add your key:
   - **Gemini:** `GEMINI_API_KEY=...` (free key at aistudio.google.com)
   - or **Claude:** `ANTHROPIC_API_KEY=...` (console.anthropic.com)
   - or **OpenAI:** `OPENAI_API_KEY=...`
4. Start:
   ```bash
   npm start
   ```
5. Open http://localhost:3000 (don't double-click index.html).

The terminal prints which provider is active. Check `http://localhost:3000/api/health` too.

## Providers
- Priority when several keys exist: Claude, then Gemini, then OpenAI.
- Claude: `ANTHROPIC_API_KEY` (default model `claude-sonnet-5`, override with `ANTHROPIC_MODEL`).
- Gemini: `GEMINI_API_KEY` (default `gemini-3.5-flash`, override with `GEMINI_MODEL`).
- OpenAI: `OPENAI_API_KEY` (default `gpt-5.6-luna`, override with `OPENAI_MODEL`).
- Force one with `AI_PROVIDER=anthropic`, `gemini` or `openai`.
- With no key, the site shows a built-in demo roadmap.

## Structure
```
server.js        Express API (analyze, github, chat, health)
public/          Front end (only this folder is served)
.env             Your secrets (never commit)
```

## Notes
- The match percentage is a current-evidence coverage indicator, not a hiring prediction.
- For production: add auth, a database, rate limiting, and privacy/consent controls.
