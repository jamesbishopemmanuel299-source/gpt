# MyGPT
Responsive ChatGPT-inspired AI chat website. The OpenAI key is stored server-side.

## Run locally
- Install Node.js 20+
- Run `npm install`
- Set `OPENAI_API_KEY` in your environment
- Run `npm start`
- Visit http://localhost:3000

## Deploy on Render
1. Create a new Web Service and connect this repository.
2. Use build command `npm install` and start command `npm start`.
3. Add `OPENAI_API_KEY` in Render → Environment as a secret.
4. Optionally set `OPENAI_MODEL` (default: `gpt-4.1-mini`).
5. Deploy.

Never commit your real API key. Chat history is currently session-only; accounts and permanent storage are not included.
