# Noctune — Project Overview

> A premium desktop-first ASMR/ambient sound application built with Next.js 16, Web Audio API, and Three.js. Procedural audio generation, immersive 3D environments, and a Spotify-grade desktop layout.

## Quick Facts

| Attribute | Value |
|-----------|-------|
| **Product** | Noctune (renamed from "Silent Circuit") |
| **Platform** | Web (desktop-first, responsive tablet/mobile) |
| **Render** | Static export (SPA with routing) |
| **Deploy target** | Cloudflare Pages |
| **State** | Active development — Phases 0–4 complete, Phases 5+ in progress |
| **URL** | https://github.com/techweave-ds/ASMR-Mixer.git |
| **Branch** | opencode/silent-circuit |

## What It Does

Noctune generates ambient/ASMR sounds entirely procedurally via the Web Audio API — no audio files are bundled. Users mix layered soundscapes (rain, wind, chimes, drones, etc.), control volume per layer, set sleep timers, save favorites, and explore curated collections. The 3D hero scene provides an immersive entry point with 7 interactive environments.

## Key Features

- **Procedural audio engine** — 56+ sound types using oscillators, noise buffers, LFO modulation, scheduled intervals
- **3D immersive hero** — Three.js/R3F scene with 3 layered mountain ranges, 200 stars, fog, fireflies, 6 interactive glass orbs, 7 environments
- **Desktop-first layout** — 100vw/100vh, fixed 280px sidebar + fluid content + 360px right panel + 92px player bar
- **Volume 2 design system** — Full design token system (bg, accent, text, surface, glass, motion vars), rounded-2xl buttons, rounded-3xl cards
- **Phase 1 component library** — Button (6 variants/4 sizes), Card (6 types), Modal, Tabs (3 variants), Toggle, TextInput, Chips, EmptyState, Slider
- **Phase 2 motion** — framer-motion page transitions (150ms fade + 220ms slide), staggered hero entrance (~2.5s), AnimatePresence
- **Phase 3 motion classes** — `.hover-lift`, `.scale-hover`, `.image-zoom`, `.stagger-enter`, `.card-hover` in globals.css
- **Phase 4 components** — Visualizer (4 modes), Toast/notification system, Dropdown (searchable), Keyboard shortcuts (⌘K, Space, M, ?)
- **Phase 5 in progress** — Settings screen (Appearance/Audio/Playback/Privacy per Vol 3 §17), Queue Panel, drag-and-drop, responsive refinements

## Current Status

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Project init, directory structure, audio engine, core stores | ✅ Complete |
| 1 | UI component library (Button, Card, Modal, Tabs, Toggle, etc.) | ✅ Complete |
| 2 | Screens, page layouts, page transitions, hero entrance sequence | ✅ Complete |
| 3 | Motion utilities, CSS animations, hover/scale/zoom classes | ✅ Complete |
| 4 | Visualizer, Toast, Dropdown, Keyboard shortcuts | ✅ Complete |
| 5 | Settings screen, Queue Panel, drag-drop, stagger-enter lists | 🔄 In progress |
| 6 | Premium screen (Vol 3 §18), Onboarding (Vol 3 §19) | ⏳ Planned |
| 7 | Responsive tablet/mobile refinements, final polish | ⏳ Planned |

## Related Documents

- [02-TECHNOLOGY.md](./02-TECHNOLOGY.md) — Full technology stack and rationale
- [03-ARCHITECTURE.md](./03-ARCHITECTURE.md) — System architecture and data flow
- [04-STRUCTURE.md](./04-STRUCTURE.md) — File/directory tree with descriptions
- [05-REQUIREMENTS.md](./05-REQUIREMENTS.md) — Product requirements, design decisions, constraints
