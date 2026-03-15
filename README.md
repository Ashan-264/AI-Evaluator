# AI-Evaluator

AI-Evaluator is a Next.js + TypeScript app for running and comparing AI/LLM evaluations (e.g., scoring model outputs, experimenting with prompts, and tracking results) using an evaluation workflow powered by libraries like **autoevals** and **braintrust**.

**Input:** evaluation data such as prompts, model responses/outputs, and optional ground-truth or scoring criteria (typically provided via the UI and/or environment configuration).  
**Output:** evaluation scores/metrics and comparison results that help you judge output quality across prompts/models/runs.

---

## Tech Stack

- **Next.js (v15)** + **React (v19)** + **TypeScript**
- **Prisma** (client + tooling) with optional **Accelerate** and **Pulse** extensions
- **Tailwind CSS**
- **autoevals** + **braintrust** for evaluation workflows
- **groq-sdk** (optional, depending on how you wire up model calls)
- **natural** (NLP utilities)

---

## Getting Started

### Prerequisites

- Node.js (recommended: latest LTS)
- npm

### Install

```bash
npm install
```

> Note: This repo runs `prisma generate --no-engine` after install (`postinstall` script).

### Run the dev server

```bash
npm run dev
```

Then open the app in your browser (Next.js will print the local URL in the terminal).

---

## Scripts

- `npm run dev` — start Next.js dev server (turbopack)
- `npm run build` — generate Prisma client and build Next.js
- `npm run start` — run the production server (after `build`)
- `npm run lint` — run lint checks
- `npm run devstart` — runs `nodemon script.ts` (only relevant if you have a `script.ts` workflow)

---

## Environment Variables

This project likely needs environment variables depending on what integrations you enable (database, model providers, Braintrust, etc.).

Create a `.env` file and add what you need, for example:

```bash
# Database (if you are using Prisma with a real DB)
DATABASE_URL="..."

# If you integrate Prisma Pulse
PULSE_API_KEY="..."

# If you wire up Groq
GROQ_API_KEY="..."
```

(Exact required variables depend on your implementation in `src/`.)

---

## Database / Prisma

If you’re using Prisma with a database:

1. Ensure `DATABASE_URL` is set in `.env`
2. Apply migrations / sync schema (depending on your setup in the `prisma/` folder)
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

---

## Project Structure (high level)

- `src/` — application source (pages/app/components, evaluation logic, etc.)
- `prisma/` — Prisma schema/migrations
- `public/` — static assets
- `hello-prisma/` — a Prisma Postgres example project (separate from the main Next.js app)

---

## Notes on `hello-prisma/`

There is a `hello-prisma/` directory containing a standalone Prisma Postgres example (queries, caching, and realtime events). If you don’t need it for AI-Evaluator, you can ignore it.

---

## License

See `LICENSE`.
