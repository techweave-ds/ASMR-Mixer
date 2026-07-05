# Noctune — Product Requirements & Conventions

## Product Identity

- **Name**: Noctune
- **Tagline**: "Find your quiet."
- **Category**: Premium ASMR/ambient sound application
- **Platform**: Web (desktop-first), static SPA
- **Target**: Users seeking focus, relaxation, sleep, or meditation through layered ambient audio

## Core Requirements

### Audio
- All sounds must be **procedurally generated** via Web Audio API — zero audio file dependencies
- 56+ distinct sound types using oscillators, noise buffers, LFO modulation, scheduled intervals
- All gain changes use `linearRampToValueAtTime` for click-free transitions (never direct `.value =`)
- Base functions (noiseSource, lfoModulate) use `setValueAtTime` for audio scheduling discipline
- Sleep timer must **fade volume gradually** over 30 seconds via `linearRampToValueAtTime`, never stop abruptly; uses `setValueAtTime` to restore gain after fade
- AudioContext must be created lazily on first user gesture (browser autoplay policy)
- `suspend()`/`resume()` for pause — preserves all node connections for instant resume
- `init()` checks `ctx.state === "suspended"` and recovers; wrapped in try-catch
- Soft ceiling of **16 concurrent sounds** (`MAX_CONCURRENT_SOUNDS`) — logs warning and ignores on overflow
- Node cleanup in `stopSound`: proper block-scoped try-catch, stops OscillatorNode/AudioBufferSourceNode, then disconnects all nodes

### Layout
- **Desktop-first**: 100vw × 100vh, no max-width containers, no centered layouts
- **Three-column app shell**: sidebar 280px | main content (fluid) | right panel 360px
- **Player always reserves 92px** at bottom — never returns null, shows idle state when silent; mobile `md:h-[82px]`
- **RightPanel always mounted** — closing sets a `closed` flag, reopen tab always visible; mobile gets bottom sheet (max-h-[70vh], spring animation)
- **Sidebar off-canvas on mobile** — hamburger toggle in TopBar, backdrop overlay, transform transition
- **BottomNav fixed at bottom on mobile** — 5 items (Home/Explore/Mixer/Favorites/Profile), `lg:hidden`
- **Home page is full-screen immersive**: no sidebar, no topbar, no right panel, `overflow-y: auto`
- `html`/`body` have `overflow: hidden` — only main content area scrolls independently
- **Mobile GPU fallback**: Hero3D detects low-power mobile devices (`navigator.hardwareConcurrency <= 4` or `deviceMemory <= 4`) and renders a static gradient instead of the Three.js scene

### Design System (Volume 2 Tokens)

```css
/* Backgrounds */
--color-bg-primary:    #090B12   (darkest)
--color-bg-secondary:  #11141D   (cards, sidebar)
--color-bg-elevated:   #171B24   (hover, elevated surfaces)

/* Accents */
--color-accent-primary:   #5A7CFF  (blue — primary actions)
--color-accent-secondary: #7B5CFF  (purple — premium)
--color-accent-success:   #38D39F  (green — success)
--color-accent-warning:   #FFC857  (amber — warning)

/* Text */
--color-text-primary:   #F8FAFC  (headings, primary content)
--color-text-secondary: #A4B1C4  (body text)
--color-text-muted:     #738197  (secondary, disabled)
```

### Glass & Surface
- Glass effect: `backdrop-filter: blur(16px)`, border `rgba(255,255,255,0.08)`
- Surface opacity for glass: 0.55
- Cards: `rounded-3xl` (24px), 24px padding, glass surface, hover lift (+6px, scale 1.01)
- Buttons: `rounded-2xl` (16px)
- Player bar: `rounded-[28px]`
- Chips: `rounded-full` (999px)
- Modals: `rounded-3xl` (24px), backdrop blur 16px
- Premium badge: glassmorphic purple (`accent-secondary` + `rgba(123,92,255,0.3)` border)

### Motion

| Context | Duration | Easing |
|---------|----------|--------|
| Hover/active states | 180ms | ease-in-out |
| Section transitions | 350ms | ease-in-out |
| Scene transitions | 1200–1800ms | spring |
| Page transitions | 150ms (fade) + 220ms (slide) | ease-in-out |
| Modal open/close | 220ms | ease-in-out |
| Toast appear/dismiss | 300ms | ease-out |
| RightPanel bottom sheet | spring (damping 28, stiffness 300) | spring |

- **Reduced motion**: disables parallax, particle loops, camera drift, continuous animations — retains fades, focus indicators, navigation cues; Counter animation in StatsSection still shows correct final value
- CSS motion variables defined in `globals.css`: `--duration-hover`, `--duration-section`, `--duration-scene`, `--duration-modal`, `--duration-drawer`, `--duration-toast`, `--easing-default`, `--easing-spring`

### Component Design

Every component must:
1. Use **Volume 2 design tokens** only (no hardcoded colors)
2. Support **keyboard navigation** (Tab, Enter, Escape, Arrow keys)
3. Meet **WCAG AA** contrast ratios
4. Show visible **focus indicators**
5. Provide **screen reader labels** (aria-labels on all icon-only buttons)
6. Have 44px+ **touch targets**
7. Support **dark mode** (system theme via prefers-color-scheme listener)
8. Animate **smoothly** with motion tokens

### Accessibility Requirements

- All interactive elements keyboard-accessible
- Screen reader labels on all controls (aria-label on Play, Pause, Shuffle, Skip, Repeat, Volume, Timer, Settings, Menu, Search, Notifications, Close, Mix panel buttons)
- Visible focus rings (not just outline removal)
- Color contrast meets WCAG AA (4.5:1 text, 3:1 large text)
- `suppressHydrationWarning` on `<body>` to handle browser extension injection (cz-shortcut-listen)

### Development Conventions

- **No comments in code** — let types and naming speak
- **No emojis** in code unless explicitly requested
- Component file names: `PascalCase.tsx`
- Path alias: `@/` maps to `src/`
- Store selectors: prefer individual selectors (`useStore(s => s.field)`) over destructuring for render optimization
- CSS: Tailwind utility classes + `globals.css` custom tokens via `var(--color-*)` or Tailwind theme
- Runtime validation: sounds.ts checks all entries for missing required fields and logs errors

### Data Validation

- `sounds.ts` performs a compile-time-adjacent runtime check: iterates all sound entries, verifies all required keys (`id`, `title`, `category`, `description`, `duration`, `coverUrl`, `color`, `gradient`, `isPremium`, `tags`) exist and `title` is non-empty
- SoundCard provides defensive fallbacks: `title || id.replace(/-/g, " ")` for display title, `description || "Ambient soundscape"` for description, `coverUrl || undefined` for safe background-image
- StatsSection derives "Curated Sounds" count from `sounds.length` and "Collections" count from `collections.length` — never hardcoded; external stats (countries, minutes) come from a static config object
- Counter component initializes with `target` value — never shows "0+" even before animation starts

### Error Handling

- Global `error.tsx` client error boundary with "Try Again" reset button
- Custom `not-found.tsx` with gradient "404" and "Go Home" link
- Offline detection in Providers: `window.addEventListener("offline"/"online")` shows toast notifications
- Audio engine init wrapped in try-catch; `AudioContext.resume()` guarded

## Next.js 16 Specifics

- This is **Next.js 16.2.7** — not the version from your training data
- Read deprecation notices in `node_modules/next/dist/docs/` before writing code
- `params` and `searchParams` are **Promises** (use `use()` or `await`)
- TailwindCSS v4 uses `@import "tailwindcss"` not `@tailwind` directives
- Tailwind custom tokens defined via `@theme inline {}` in `globals.css`
- `sitemap.ts` and `robots.ts` require `export const dynamic = "force-static"` for static export

## Deployment

| Aspect | Configuration |
|--------|---------------|
| **Provider** | Cloudflare Pages |
| **Live URL** | https://noctune.pages.dev |
| **Build** | `npx next build` (static export) |
| **Output dir** | `out/` |
| **Config** | `output: "export"`, `images.unoptimized: true`, `trailingSlash: true` |
| **Cache** | `public/_headers` — 1yr immutable for `/_next/static/*` |
| **Git remote** | `origin → https://github.com/techweave-ds/ASMR-Mixer.git` |

## Key Constraints

| Constraint | Reason |
|------------|--------|
| No SSR — full static export | Cloudflare Pages doesn't run Node.js |
| Web Audio API requires user gesture | Browser autoplay policy |
| AudioContext not serializable | Audio store intentionally not persisted |
| body `overflow: hidden` | Desktop app feel — only content areas scroll |
| Three.js `frameloop="demand"`, `dpr [0.5, 1]` | Performance on integrated GPUs |
| Images unoptimized (no next/image) | Static export limitation |
| No audio files | Zero bundle size, procedural generation |
| `force-static` on sitemap/robots | Static export requires explicit static marker |
| `useStoreHydration` must guard persisted-store reads | Static export + localStorage hydrates after mount |
| `suppressHydrationWarning` on html/body | Browser extensions (cz-shortcut-listen) inject into DOM |

## Route Design

| Route | Page Type | Layout | Description |
|-------|-----------|--------|-------------|
| `/` | Landing | Immersive (no shell) | Full-screen 3D hero + scroll narrative |
| `/explore` | Browse | App shell | Browse all 56+ sounds by category |
| `/mixer` | Tool | App shell | Layer mixer with save/load |
| `/favorites` | Library | App shell | Saved sounds and collections |
| `/profile` | Account | App shell | User profile and preferences |
| `/settings` | Config | App shell | Settings per Volume 3 §17 |
| `/sitemap.xml` | SEO | - | Dynamic sitemap (force-static) |
| `/robots.txt` | SEO | - | Robot rules (force-static) |
