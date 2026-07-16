# Noctune — Page Layouts & Component Breakdown

This document describes every page/route in the app, its layout structure, every component rendered, and responsive behavior.

## Route Map

| Route | Page Component | Layout Mode | Description |
|-------|---------------|-------------|-------------|
| `/` | `page.tsx` → `HomeContent` | Immersive (no shell) | Full-screen hero + narrative scroll sections |
| `/explore` | `explore/page.tsx` → `ExploreContent` | App shell | Sound browser with search + category filter |
| `/mixer` | `mixer/page.tsx` → `MixerContent` | App shell | Layer-based sound mixing with presets |
| `/favorites` | `favorites/page.tsx` → `FavoritesContent` | App shell | Saved sounds and collections |
| `/profile` | `profile/page.tsx` → `ProfileContent` | App shell | Account, stats, listening history |
| `/settings` | `settings/page.tsx` → `SettingsContent` | App shell | 4-tab settings panel |
| `/support` | `support/page.tsx` → `SupportContent` | App shell | FAQ accordion + contact |
| `/privacy` | `privacy/page.tsx` → `PrivacyContent` | App shell | Privacy policy |
| `/terms` | `terms/page.tsx` → `TermsContent` | App shell | Terms of service |
| 404 | `not-found.tsx` | None (standalone) | Custom 404 page |
| Error | `error.tsx` | None (standalone) | Error boundary |

## Two Layout Modes

### Immersive Mode (Home Page `/`)

```
┌─────────────────────────────────────────┐
│  div.h-screen.overflow-y-auto            │
│  ┌─────────────────────────────────────┐ │
│  │  Hero Section (h-screen)            │ │
│  │  ├── Hero3D (Three.js canvas)       │ │
│  │  ├── HeroOverlay                    │ │
│  │  │   ├── Logo (top-left)            │ │
│  │  │   ├── Desktop nav links (md+)    │ │
│  │  │   ├── Headline + subhead (left)  │ │
│  │  │   ├── CTA buttons (stack on sm)  │ │
│  │  │   ├── Now Playing card (right)   │ │
│  │  │   ├── Environment pills (right)  │ │
│  │  │   ├── Mobile env strip (bottom)  │ │
│  │  │   └── Scroll indicator            │ │
│  │  └── Bottom gradient transition      │ │
│  ├── HomeContent sections:              │ │
│  │   ├── MoodPicker                     │ │
│  │   ├── EnvironmentsCarousel           │ │
│  │   ├── StatsSection                   │ │
│  │   └── MiniMixer                      │ │
│  ├── PlayerBar (scrolls into view)      │ │
│  └── BottomNav (mobile only)            │ │
│  ── Persistent overlays ──              │ │
│  SearchContent (z-50 overlay)           │ │
│  AmbientOverlay (z-50 fullscreen)       │ │
│  KeyboardShortcutsHelp (z-50 modal)     │ │
│  ToastContainer (z-60)                  │ │
└─────────────────────────────────────────┘
```

**Responsive notes:**
- Hero section fills viewport on all sizes
- Desktop nav links hidden below `md:` (replaced by BottomNav)
- Right panel (Now Playing + env selector) hidden below `lg:`, replaced by horizontal env strip at `bottom-20`
- CTA buttons stack vertically on `sm:`
- PlayerBar/BottomNav are at the BOTTOM of the scroll container (not fixed), so the user scrolls past the hero and content sections to reach them

### App Shell Mode (All Other Pages)

```
┌───────────────────────────────────────────────────────────┐
│  div.h-screen.w-screen.flex.flex-col                      │
│  ┌───────────────────────────────────────────────────────┐│
│  │  div.flex.flex-1.min-h-0                              ││
│  │  ┌──────────┬────────────────────────┬──────────────┐ ││
│  │  │ Sidebar  │  div.flex-1.flex-col   │ RightPanel   │ ││
│  │  │ 280px    │  ┌──────────────────┐  │ 360px        │ ││
│  │  │ fixed on │  │   TopBar         │  │ desktop only │ ││
│  │  │ mobile   │  │   (frosted glass)│  │ bottom sheet │ ││
│  │  │ slide-in │  ├──────────────────┤  │ on mobile    │ ││
│  │  │ w/       │  │   main           │  └──────────────┘ ││
│  │  │ backdrop │  │   overflow-y-auto│                   ││
│  │  │          │  │   AnimatePresence│                   ││
│  │  │          │  │   px-6 py-6      │                   ││
│  │  │          │  └──────────────────┘                   ││
│  │  └──────────┴────────────────────────┘               ││
│  ├───────────────────────────────────────────────────────┤│
│  │  PlayerBar (72px mobile / 92px desktop)               ││
│  ├───────────────────────────────────────────────────────┤│
│  │  BottomNav (64px, mobile only)                        ││
│  └───────────────────────────────────────────────────────┘│
│  ── Persistent overlays ──                                │
│  SearchContent, AmbientOverlay, KeyboardShortcutsHelp,    │
│  ToastContainer                                           │
└───────────────────────────────────────────────────────────┘
```

**Responsive notes:**
- `< lg:` Sidebar becomes off-canvas slide-in drawer (fixed, z-50, `-translate-x-full` / `translate-x-0`)
- `< lg:` RightPanel becomes bottom sheet (`max-h-[70vh]`)
- `< lg:` BottomNav visible, TopBar shows hamburger instead of sidebar
- `< lg:` PlayerBar height reduces to 72px
- `>= lg:` Full desktop layout with sidebar + right panel always visible

---

## Page Layout Details

### Home Page (`/`)

**File:** `app/page.tsx` → renders `<HomeContent />`

**HomeContent** renders an `h-screen overflow-y-auto` scroll container containing:

| Section | Component | Description |
|---------|-----------|-------------|
| Hero | `HeroOverlay` + `Hero3D` | Full-viewport 3D scene with orbs, environment selectors, rotating headlines |
| Mood | `MoodPicker` | Horizontal scrollable mood/category chips (focus, sleep, relax, etc.) with 3 sound suggestions each |
| Environments | `EnvironmentsCarousel` | Featured environment cards (rainforest, ocean, campfire, etc.) with play/active state |
| Stats | `StatsSection` | Live statistics display (active listeners, sounds, moods, collections) |
| Mini Mixer | `MiniMixer` | Quick-access layer list showing currently playing sounds with volume sliders |

**Z-Index layering in hero:**
- `z-0`: 3D canvas
- `z-[1]`: Gradient vignettes (left/right + bottom)
- `z-10`: Hero overlay content (text, nav, CTAs, env strip)
- `z-20`: Bottom gradient transition

### Explore Page (`/explore`)

**Files:** `app/explore/page.tsx` → `ExploreContent`

| Section | Description |
|---------|-------------|
| Header | Title "Explore" + subtitle "Discover sounds that match your mood" |
| Search | Text input with autocomplete dropdown (keyword-based suggestions) |
| Category chips | Horizontally scrollable pill buttons (All, Rain, Thunder, Wind, etc.) — visible scrollbar hidden, right-edge fade gradient indicates scrollability |
| Sound grid | `grid-cols-2` to `2xl:grid-cols-7` responsive grid of `SoundCard` instances |
| Empty state | Shown when no sounds match filter/search — icon + "No sounds found" message |

**Keyboard interaction:** Search input on focus shows suggestion dropdown; clicking a suggestion or pressing Enter with suggestion selected sets query.

### Mixer Page (`/mixer`)

**Files:** `app/mixer/page.tsx` → `MixerContent`

| Section | Description |
|---------|-------------|
| Header | Title "Sound Mixer" + subtitle + "Save Mix" and "Add Sound" buttons |
| Master Channel | Volume slider for overall mix, shows layer count (e.g., "3/10 layers") |
| Layer list | Each layer row: gradient icon → sound title/category → volume slider → percentage → mute button → delete button |
| Add Sound Panel | Togglable grid of available sounds (not yet added) with "Add" overlay on hover |
| Save Dialog | Modal overlay (z-50) with text input for preset name + Save/Cancel |

**Layer row layout (desktop):** `flex items-center gap-4` with h-10 w-10 icon, flex-1 text column, slider (w-20 sm:w-28), percentage (w-8), mute/delete buttons.
**Layer row layout (mobile, < 640px):** Gap reduces to `gap-3`, padding to `p-3`.
**Responsive grid for add panel:** `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`.

### Favorites Page (`/favorites`)

**Files:** `app/favorites/page.tsx` → `FavoritesContent`

| Section | Description |
|---------|-------------|
| Header | Title "Favorites" + clear all button |
| Sound grid | `grid-cols-2 sm:grid-cols-3 md:grid-cols-4` grid of favorited `SoundCard` instances |
| Collection cards | Saved collections shown below sounds |
| Empty state | Heart icon + "No favorites yet" message + "Explore sounds" CTA |

State is persisted via zustand `persist` middleware (localStorage key: `noctune-favorites-storage`).

### Profile Page (`/profile`)

**Files:** `app/profile/page.tsx` → `ProfileContent`

| Section | Description |
|---------|-------------|
| User avatar | Gradient circle with initials |
| Display name | "Listener" + member since date |
| Stats row | Sounds played, listening time (hours), favorites count |
| Quick settings | Theme toggle, sleep timer presets, crossfade toggle |
| Links | Settings, Support, Privacy, Terms navigation items |

### Settings Page (`/settings`)

**Files:** `app/settings/page.tsx` → `SettingsContent`

| Tab | Sections |
|-----|----------|
| Appearance | Theme selector (Dark/Light/System as segmented buttons), Reduced Motion toggle |
| Audio | Crossfade duration slider + toggle, Volume Normalization toggle, Default Sleep Timer presets (15/30/45/60/120 min) |
| Playback | Autoplay toggle, Loop toggle, Auto-clear Timer on Pause toggle, Resume Previous Session toggle |
| Privacy | Usage Analytics toggle, Crash Reports toggle, Download Management link |

Settings are persisted (localStorage key: `noctune-settings-storage`).

### Content Pages (`/support`, `/privacy`, `/terms`)

**Support:** FAQ accordion with expandable questions + email/contact section.
**Privacy:** Privacy policy sections (Information We Collect, How We Use It, Data Security, Your Rights, etc.).
**Terms:** Terms of service sections (Acceptance, Account, Subscriptions, Intellectual Property, Disclaimer, Governing Law, Contact).

### 404 Page (`/_not-found`)

Custom gradient background with "404" title, "Page not found" message, "Go Home" link. No layout shell.

### Error Page (`error.tsx`)

Client error boundary. Shows error icon + "Something went wrong" message + error details + "Try Again" button (calls `reset()`).

---

## Persistent Overlays (rendered in Providers)

These render at the root level and appear above all page content:

| Overlay | Trigger | Z-Index | Behavior |
|---------|---------|---------|----------|
| `SearchContent` | ⌘K / Ctrl+K | z-50 | Full-screen overlay, auto-focuses input, keyboard nav for suggestions |
| `AmbientOverlay` | Moon button in PlayerBar | z-50 | Full-screen dimmed mode; auto-hides cursor after 3s; ESC or click-outside to exit |
| `KeyboardShortcutsHelp` | `?` key | z-50 | Modal with grouped keyboard shortcut listing |
| `ToastContainer` | Dispatched from code | z-60 | Fixed bottom-right; supports success/error/warning/info types; auto-dismiss |
