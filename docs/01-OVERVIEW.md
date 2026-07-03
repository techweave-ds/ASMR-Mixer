# Noctune — Project Overview

> A premium desktop-first ASMR/ambient sound application built with Next.js 16, Web Audio API, and Three.js. Procedural audio generation, immersive 3D environments, and a Spotify-grade desktop layout.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Product** | Noctune |
| **Platform** | Web (desktop-first, responsive tablet/mobile) |
| **Render** | Static export (SPA with routing) |
| **Deploy target** | Cloudflare Pages |
| **State** | Production-readiness audit — Prompts A–L (A–J complete) |
| **URL** | https://noctune.pages.dev |
| **Source** | https://github.com/techweave-ds/ASMR-Mixer.git |

## What It Does

Noctune generates ambient/ASMR sounds entirely procedurally via the Web Audio API — no audio files are bundled. Users mix layered soundscapes (rain, wind, chimes, drones, etc.), control volume per layer, set sleep timers, save favorites, and explore curated collections. The 3D hero scene provides an immersive entry point with 7 interactive environments.

## Key Features

- **Procedural audio engine** — 56+ sound types using oscillators, noise buffers, LFO modulation, scheduled intervals; linear ramps for all gain changes; soft ceiling at 16 concurrent sounds; suspended-state recovery
- **3D immersive hero** — Three.js/R3F scene with mountain ranges, stars, fog, fireflies, 6 interactive glass orbs, 7 environments; auto-degrades to static gradient on low-power mobile GPUs
- **Desktop-first layout** — 100vw/100vh, fixed 280px sidebar + fluid content + 360px right panel + 92px player bar + mobile bottom nav
- **Volume 2 design system** — Full design token system (bg, accent, text, surface, glass, motion vars), rounded-2xl buttons, rounded-3xl cards, glassmorphism
- **Settings screen** — 4-tab settings (Appearance/Audio/Playback/Privacy) per Vol 3 §17, system theme support, crossfade, sleep timer
- **Queue Panel** — framer-motion Reorder drag-and-drop queue, per-sound volume sliders, duplicate/remove
- **Toast/notification system** — 4 types (success/error/warning/info), auto-dismiss, offline detection
- **Keyboard shortcuts** — ⌘K (search), Space (pause), M (mute toast), ? (help modal)
- **Accessibility** — aria-labels on all icon buttons, keyboard nav, WCAG AA contrast, reduced-motion support
- **SEO** — Per-route metadata, Open Graph, Twitter cards, sitemap.xml, robots.txt, JSON-LD

## Current Status

| Prompt | Focus | Status |
|--------|-------|--------|
| A | Hero overlap fix — bg-bg-primary on content, overflow-hidden on hero | ✅ Complete |
| B | Home route sidebar/topbar/rightpanel suppression | ✅ Verified |
| C | StatsSection — real sounds.length + collections.length, non-zero fallback | ✅ Complete |
| D | SoundCard defensive fallbacks, data validation in sounds.ts | ✅ Complete |
| E | Legacy branding removal — all references use "Noctune" | ✅ Verified |
| F | not-found.tsx, error.tsx, offline detection toast | ✅ Complete |
| G | Audio engine QA — linear ramps, node cleanup, soft ceiling at 16 | ✅ Complete |
| H | Mobile responsive — GPU fallback, BottomNav 5 items, player above nav | ✅ Complete |
| I | Accessibility — aria-labels on all icon buttons, keyboard nav pass | ✅ Complete |
| J | SEO — metadata per route, sitemap.xml, robots.txt, OG/Twitter cards | ✅ Complete |
| K | Testing — Vitest config, store + engine tests | 🔄 In progress |
| L | Auth/payments — decision doc, Stripe scaffold, useEntitlement() | ⏳ Planned |

## Related Documents

- [02-TECHNOLOGY.md](./02-TECHNOLOGY.md) — Full technology stack and rationale
- [03-ARCHITECTURE.md](./03-ARCHITECTURE.md) — System architecture and data flow
- [04-STRUCTURE.md](./04-STRUCTURE.md) — File/directory tree with descriptions
- [05-REQUIREMENTS.md](./05-REQUIREMENTS.md) — Product requirements, design decisions, constraints
