# Noctune — File & Directory Structure

## Source Tree

```
src/
├── app/                          # Next.js App Router pages
│   ├── globals.css               # Global CSS: tokens, motion vars, utilities
│   ├── layout.tsx                # Root layout: Inter font, dark class, suppressHydrationWarning
│   ├── page.tsx                  # /  — Home page (imports no client components directly)
│   ├── explore/page.tsx          # /explore
│   ├── favorites/page.tsx        # /favorites
│   ├── mixer/page.tsx            # /mixer
│   ├── profile/page.tsx          # /profile
│   └── settings/page.tsx         # /settings
│
├── audio/                        # Procedural audio engine
│   ├── index.ts                  # Barrel export
│   └── engine.ts                 # AudioEngine class (singleton) — 56+ sound configs, oscillator/noise/LFO generation
│
├── components/                   # React components
│   ├── collections/
│   │   └── CollectionCard.tsx     # Curated collection card with cover, title, sound count
│   │
│   ├── explore/
│   │   └── ExploreContent.tsx     # Sound browser: category filters, search, grid of SoundCards
│   │
│   ├── favorites/
│   │   └── FavoritesContent.tsx   # Saved sounds + collections display
│   │
│   ├── hero/                     # 3D immersive hero section (home page)
│   │   ├── Hero3D.tsx            # Three.js/R3F scene: mountains, stars, fog, fireflies, 6 orbs, 7 envs
│   │   ├── HeroOverlay.tsx       # Text overlays, entrance sequence, taglines, floating controls
│   │   ├── EnvironmentSelector.tsx  # Horizontally scrollable pill carousel for 7 environments
│   │   ├── ExploreButton.tsx     # Persistent compass pill — centered then bottom-right on scroll
│   │   └── FloatingControls.tsx  # Bottom-right panel: volume, ambient, day/night, fullscreen
│   │
│   ├── home/                     # Narrative sections below hero
│   │   ├── HomeContent.tsx       # Main content: hero → Why → Feel → Stats → Envs → Collections → footer
│   │   ├── EnvironmentsCarousel.tsx  # Horizontal scroll of environment cards
│   │   ├── ExperienceCards.tsx   # Feature highlight cards
│   │   ├── StatsSection.tsx      # Statistics display ("Quiet Is Contagious")
│   │   └── UseCasesSection.tsx   # Use case showcase
│   │
│   ├── layout/                   # App shell layout components
│   │   ├── Providers.tsx         # Root provider: theme, reduced-motion, page transitions, keyboard shortcuts
│   │   ├── Sidebar.tsx           # 280px nav: routes, library, collections, premium card, profile footer
│   │   ├── TopBar.tsx            # Header: scroll-aware frosted glass, search trigger, nav arrows
│   │   ├── RightPanel.tsx        # 360px panel: current mix, timer countdown, volume, queue — always mounted
│   │   └── BottomNav.tsx         # Mobile bottom navigation bar
│   │
│   ├── mixer/
│   │   └── MixerContent.tsx      # Layer mixer: volume per sound, solo/mute, save/load presets
│   │
│   ├── player/
│   │   ├── PlayerBar.tsx         # 92px player: always visible, progress, volume, pause, timer, visualizer
│   │   └── QueuePanel.tsx        # Sound queue: reorder, duplicate, remove
│   │
│   ├── profile/
│   │   ├── ProfileContent.tsx    # User profile: stats, listening history, preferences
│   │   └── SettingsContent.tsx   # Settings: Appearance, Audio, Playback, Privacy (Vol 3 §17)
│   │
│   ├── search/
│   │   └── SearchContent.tsx     # Full-screen overlay search (⌘K trigger)
│   │
│   └── ui/                       # Design system component library
│       ├── Button.tsx            # 6 variants, 4 sizes, 8 states, rounded-2xl
│       ├── Card.tsx              # 6 types, 3 padding sizes, glass surface, hover lift
│       ├── Chip.tsx              # Quick-filter pills, selected state, rounded-full
│       ├── Dropdown.tsx          # Searchable (10+ items), arrow-key nav, keyboard accessible
│       ├── EmptyState.tsx        # 4 types: empty/search/error/offline
│       ├── Equalizer.tsx         # Animated equalizer bars for active state indicator
│       ├── GlassCard.tsx         # Glassmorphism card primitive
│       ├── Modal.tsx             # Max 640px, backdrop blur 16px, focus trap, Escape close
│       ├── Slider.tsx            # Range slider with accent-primary CSS variable
│       ├── SoundCard.tsx         # Sound display: cover, title, category, play/fav actions
│       ├── Tabs.tsx              # 3 variants: underline, pill, segmented
│       ├── TextInput.tsx         # 48px height, 6 variants, label/helper/error/icon slots
│       ├── ToastContainer.tsx    # Fixed bottom-right toast stack, auto-dismiss 4s
│       ├── Toggle.tsx            # Animated switch, ARIA switch role
│       ├── Visualizer.tsx        # 4 modes: minimal, ambient, wave, pulse — canvas-based
│       └── Waveform.tsx          # Waveform visualization primitive
│
├── data/                         # Static data / content
│   ├── sounds.ts                 # 56+ sound definitions with Unsplash covers, gradients, categories, tags
│   └── collections.ts           # 15 premium collection presets with sound combinations
│
├── hooks/                        # Custom React hooks
│   └── useKeyboardShortcuts.ts   # Global keyboard shortcuts (⌘K, Space, M, ?)
│
├── lib/                          # Shared utilities
│   └── utils.ts                  # cn() — className merge using clsx + tailwind-merge
│
├── store/                        # Zustand state management
│   ├── index.ts                  # Barrel export of all stores
│   ├── audio-store.ts            # Audio playback state + actions (NOT persisted)
│   ├── mixer-store.ts            # Mixer layers, presets (persisted)
│   ├── favorites-store.ts        # Favorites sounds + collections (persisted)
│   ├── settings-store.ts         # Theme, reduced motion, crossfade, timer, notifications (persisted)
│   ├── ui-store.ts               # Sidebar, search, right panel visibility (persisted)
│   └── toast-store.ts            # Toast notification queue (NOT persisted)
│
└── types/                        # TypeScript type definitions
    ├── index.ts                  # Barrel export
    └── sound.ts                  # Sound, Collection, Category, MixerPreset types
```

## Root Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts (dev, build, lint, deploy) |
| `tsconfig.json` | TypeScript config — path aliases (`@/` → `src/`) |
| `next.config.ts` | Next.js config — static export, unoptimized images, trailing slash |
| `postcss.config.mjs` | PostCSS with TailwindCSS plugin |
| `wrangler.toml` | Cloudflare Pages CLI config |
| `AGENTS.md` | AI agent instructions (Next.js 16 deprecation notice) |
| `CLAUDE.md` | Points to AGENTS.md |
| `README.md` | Project overview (see docs/ for full documentation) |
| `public/_headers` | Cloudflare Pages security + cache headers |

## Route → File Mapping

| URL | Page File | Content Component |
|-----|-----------|-------------------|
| `/` | `src/app/page.tsx` | No direct content — layout renders hero + home |
| `/explore` | `src/app/explore/page.tsx` | `<ExploreContent />` |
| `/favorites` | `src/app/favorites/page.tsx` | `<FavoritesContent />` |
| `/mixer` | `src/app/mixer/page.tsx` | `<MixerContent />` |
| `/profile` | `src/app/profile/page.tsx` | `<ProfileContent />` |
| `/settings` | `src/app/settings/page.tsx` | `<SettingsContent />` |

## Build Output

| Path | Description |
|------|-------------|
| `out/` | Static export root |
| `out/index.html` | Home page |
| `out/explore/index.html` | Explore page |
| `out/favorites/index.html` | Favorites page |
| `out/mixer/index.html` | Mixer page |
| `out/profile/index.html` | Profile page |
| `out/settings/index.html` | Settings page |
| `out/_next/static/` | Next.js JS/CSS chunks (immutable, 1yr cache) |
