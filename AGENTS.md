# AGENTS.md — AI Instructions

This file tells AI coding assistants how to work with this project.

## First: Read the docs

Before writing any code, read all files in `docs/` to understand the project:

1. `docs/01-OVERVIEW.md` — what this project is, current status
2. `docs/02-TECHNOLOGY.md` — tech stack and why each choice was made
3. `docs/03-ARCHITECTURE.md` — how components, stores, and the audio engine interact
4. `docs/04-STRUCTURE.md` — every file and directory purpose
5. `docs/05-REQUIREMENTS.md` — design specs, constraints, conventions

## Next.js 16 Warning

This is NOT the Next.js you may know. Read `node_modules/next/dist/docs/` before writing any route or layout code. Pay attention to deprecation notices — `params` and `searchParams` are Promises (use `use()` or `await`), and TailwindCSS v4 uses `@import "tailwindcss"` not `@tailwind`.

## Key Rules

- **Procedural audio only** — no audio files, Web Audio API exclusively
- **Volume 2 design tokens** — no hardcoded colors, use `var(--color-*)` or Tailwind `bg-bg-secondary`, etc.
- **Desktop-first** — 100vw × 100vh, no max-width, three-column app shell
- **Static export** — no SSR, no API routes, `output: "export"`
- **No comments** in source code — let types and naming be self-documenting
- **No emojis** in code unless explicitly requested
- **aria-labels on all icon-only buttons** — accessibility requirement
- **linearRampToValueAtTime for all audio gain changes** — never direct `.value =` for gain
- **useStoreHydration must guard persisted-store reads** — prevents SSR/static hydration mismatch
- **Stats must derive from real data** — never hardcode sounds.length, collections.length
- **Counter must initialize at target value** — never start at 0 (avoids "0+" display)
- **Verify with `npx next build`** — must compile clean (0 errors, 0 warnings)
