# Noctune — File & Directory Structure

## Source Tree

```
src/
├── app/                          # Next.js App Router pages
│   ├── globals.css               # Global CSS: tokens, motion vars, utilities, color-mix glows
│   ├── layout.tsx                # Root layout: Inter font, dark class, metadata/OG/Twitter
│   ├── page.tsx                  # /  — Home page (metadata export)
│   ├── not-found.tsx             # Custom 404 with gradient title + Go Home link
│   ├── error.tsx                 # Client error boundary with Try Again reset
│   ├── sitemap.ts                # Dynamic sitemap.xml generation (force-static)
│   ├── robots.ts                 # robots.txt generation (force-static)
│   ├── explore/page.tsx          # /explore (metadata export)
│   ├── favorites/page.tsx        # /favorites (metadata export)
│   ├── mixer/page.tsx            # /mixer (metadata export)
│   ├── profile/page.tsx          # /profile (metadata export)
│   └── settings/page.tsx         # /settings (metadata export)
│
├── audio/                        # Procedural audio engine
│   ├── index.ts                  # Barrel export
│   └── engine.ts                 # AsmrAudioEngine class (singleton) — 56+ sound builders, noise/osc/LFO/interval gen, linear ramps, MAX_CONCURRENT_SOUNDS
│
├── components/                   # React components
│   ├── collections/
│   │   └── CollectionCard.tsx     # Curated collection card with cover, title, sound count
│   │
│   ├── explore/
│   │   └── ExploreContent.tsx     # Sound browser: horizontal scroll chips, grid of SoundCards
│   │
│   ├── favorites/
│   │   └── FavoritesContent.tsx   # Saved sounds + collections display
│   │
│   ├── hero/                     # 3D immersive hero section (home page)
│   │   ├── Hero3D.tsx            # Three.js/R3F scene + low-performance mobile GPU fallback gradient
│   │   ├── HeroOverlay.tsx       # Text overlays, entrance sequence, taglines, floating controls
│   │   ├── EnvironmentSelector.tsx  # Horizontally scrollable pill carousel for 7 environments
│   │   ├── ExploreButton.tsx     # Persistent compass pill — centered then bottom-right on scroll
│   │   └── FloatingControls.tsx  # Bottom-right panel: volume, ambient, day/night, fullscreen
│   │
│   ├── home/                     # Narrative sections below hero
│   │   ├── HomeContent.tsx       # bg-bg-primary sections block hero bleed-through, hero overflow-hidden
│   │   ├── EnvironmentsCarousel.tsx  # Horizontal scroll of environment cards
│   │   ├── ExperienceCards.tsx   # Feature highlight cards
│   │   ├── StatsSection.tsx      # Real data from sounds.length + collections.length + static config
│   │   └── UseCasesSection.tsx   # Use case showcase
│   │
│   ├── layout/                   # App shell layout components
│   │   ├── Providers.tsx         # Root provider: theme system, reduced-motion, page transitions,
│   │   │                         # keyboard shortcuts, offline detection toast
│   │   ├── Sidebar.tsx           # 280px nav: off-canvas on mobile, routes, library, premium card
│   │   ├── TopBar.tsx            # Header: scroll-aware frosted glass, hamburger menu (mobile), notifications
│   │   ├── RightPanel.tsx        # 360px desktop / bottom sheet mobile, always mounted, timer, layers
│   │   └── BottomNav.tsx         # Mobile bottom nav (5 items, fixed bottom, lg:hidden)
│   │
│   ├── mixer/
│   │   └── MixerContent.tsx      # Layer mixer: volume per sound, solo/mute, save/load presets
│   │
│   ├── player/
│   │   ├── PlayerBar.tsx         # 92px player: always visible, shuffle/prev/play/next/repeat, volume,
│   │   │                         # sleep timer, mix panel toggle, output device — aria-labels on all buttons
│   │   └── QueuePanel.tsx        # framer-motion Reorder drag-and-drop queue, per-sound volume sliders
│   │
│   ├── profile/
│   │   ├── ProfileContent.tsx    # User profile: stats, listening history, preferences, version
│   │   └── SettingsContent.tsx   # 4-tab settings: Appearance (Dark/Light/System), Audio (crossfade),
│   │                             # Playback (sleep timer), Privacy (analytics)
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
│       ├── SoundCard.tsx         # Sound display: gradient + coverUrl (stacked), title/description fallbacks
│       ├── Tabs.tsx              # 3 variants: underline, pill, segmented
│       ├── TextInput.tsx         # 48px height, 6 variants, label/helper/error/icon slots
│       ├── ToastContainer.tsx    # Fixed bottom-right toast stack, auto-dismiss 4s
│       ├── Toggle.tsx            # Animated switch, ARIA switch role
│       ├── Visualizer.tsx        # 4 modes: minimal, ambient, wave, pulse — canvas-based
│       └── Waveform.tsx          # Waveform visualization primitive
│
├── data/                         # Static data / content
│   ├── sounds.ts                 # 56+ sound definitions id/title/category/desc/duration/cover/gradient/premium/tags
│   │                             # + runtime validation checks for missing required fields
│   └── collections.ts           # 15 premium collection presets with sound combinations
│
├── hooks/                        # Custom React hooks
│   ├── useKeyboardShortcuts.ts   # Global keyboard shortcuts (⌘K, Space, M, ?)
│   └── useStoreHydration.ts      # Returns true after mount — prevents persisted-store SSR mismatch
│
├── lib/                          # Shared utilities
│   └── utils.ts                  # cn() — className merge using clsx + tailwind-merge
│
├── store/                        # Zustand state management
│   ├── index.ts                  # Barrel export of all stores
│   ├── audio-store.ts            # Audio playback state + actions (NOT persisted)
│   ├── mixer-store.ts            # Mixer layers, presets, queue order (persisted)
│   ├── favorites-store.ts        # Favorites sounds + collections (persisted)
│   ├── settings-store.ts         # Theme (dark/light/system), reduced motion, crossfade, sleep, premium (persisted)
│   ├── ui-store.ts               # Sidebar, search, right panel visibility (persisted)
│   └── toast-store.ts            # Toast notification queue (NOT persisted)
│
└── types/                        # TypeScript type definitions
    ├── index.ts                  # Barrel export
    └── sound.ts                  # Sound, Collection, Category, MixerPreset, SoundLayer types
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
| `/` | `src/app/page.tsx` | `<HomeContent />` |
| `/explore` | `src/app/explore/page.tsx` | `<ExploreContent />` |
| `/favorites` | `src/app/favorites/page.tsx` | `<FavoritesContent />` |
| `/mixer` | `src/app/mixer/page.tsx` | `<MixerContent />` |
| `/profile` | `src/app/profile/page.tsx` | `<ProfileContent />` |
| `/settings` | `src/app/settings/page.tsx` | `<SettingsContent />` |
| 404 | `src/app/not-found.tsx` | Inline 404 UI |
| Error | `src/app/error.tsx` | Client error boundary |
| `/sitemap.xml` | `src/app/sitemap.ts` | Dynamic (force-static) |
| `/robots.txt` | `src/app/robots.ts` | Dynamic (force-static) |

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
| `out/sitemap.xml` | Generated sitemap |
| `out/robots.txt` | Generated robots.txt |
| `out/_next/static/` | Next.js JS/CSS chunks (immutable, 1yr cache) |
