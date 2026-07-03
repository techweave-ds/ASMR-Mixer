# Noctune — Architecture & Data Flow

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
│  /  /explore  /mixer  /favorites  /profile  /settings   │
│  /robots.txt  /sitemap.xml  /_not-found                  │
├─────────────────────────────────────────────────────────┤
│                    Providers (layout)                    │
│  ┌─────────┬─────────────────────┬──────────────┐       │
│  │ Sidebar │  <main>             │ RightPanel   │       │
│  │ 280px   │  (content, scroll)  │ 360px        │       │
│  ├─────────┴─────────────────────┴──────────────┤       │
│  │              PlayerBar (92px)                 │       │
│  ├──────────────────────────────────────────────┤       │
│  │              BottomNav (mobile, 64px)         │       │
│  └──────────────────────────────────────────────┘       │
│  SearchContent (⌘K overlay)                              │
│  ToastContainer (fixed bottom-right)                     │
└─────────────────────────────────────────────────────────┘
```

## Two Layout Modes

| Page | Layout | Description |
|------|--------|-------------|
| `/` (Home) | Immersive | Full-screen hero, no sidebar/topbar/rightpanel, `overflow-y-auto` |
| All other pages | App shell | Sidebar \| content+topbar \| right panel + player bar + bottom nav |

## Component Hierarchy

```
Providers (wraps all routes)
├── ToastContainer (fixed bottom-right, z-60)
├── SearchContent (full-screen overlay, toggled via ⌘K)
│
├── [HOME PAGE] ─── div.h-screen.overflow-y-auto
│   ├── Hero3D (Three.js canvas, 100vh, auto-degraded to static on low-power mobile)
│   ├── HeroOverlay (text overlays, entrance sequence)
│   ├── HomeContent (opaque bg-bg-primary sections, blocks hero bleed-through)
│   ├── PlayerBar (always at bottom)
│   └── BottomNav (mobile only)
│
└── [OTHER PAGES] ─── div.h-screen.flex
    ├── Sidebar (280px, off-canvas on mobile, nav + library + premium card)
    ├── div.flex-1
    │   ├── TopBar (scroll-aware frosted glass, hamburger on mobile)
    │   └── main (overflow-y-auto, AnimatePresence pages)
    └── RightPanel (360px desktop / bottom sheet mobile, always mounted)
    │
    ├── PlayerBar (always at bottom, 92px desktop / 82px mobile)
    └── BottomNav (fixed bottom, 5 items, mobile only)
```

## Page → Content Component Mapping

| Route | Content Component | Description |
|-------|-------------------|-------------|
| `/` | Hero3D + HeroOverlay + HomeContent | Full-screen 3D hero + narrative scroll |
| `/explore` | ExploreContent | Sound browser with category chips, horizontal scroll |
| `/mixer` | MixerContent | Layer mixer with save/load presets |
| `/favorites` | FavoritesContent | Saved sounds and collections |
| `/profile` | ProfileContent | Account, stats, listening history |
| `/settings` | SettingsContent | Appearance, Audio, Playback, Privacy (Vol 3 §17) |
| 404 | not-found.tsx | Custom 404 with gradient title + Go Home link |
| Error | error.tsx | Client error boundary with Try Again reset |

## Store Architecture

```
                   ┌─────────────────┐
                   │   Components     │
                   │ (read via hooks) │
                   └────────┬────────┘
                            │ selectors
                            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Audio    │  │ Mixer    │  │Favorites │  │Settings  │  │ UI       │  │ Toast    │  │ Search   │
│ Store    │  │ Store    │  │ Store    │  │ Store    │  │ Store    │  │ Store    │  │ Store    │
├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤
│ isPlaying│  │ layers[] │  │sounds[]  │  │ theme    │  │sidebar   │  │toasts[]  │  │ query    │
│ isPaused │  │ presets[]│  │collections│  │reduced   │  │search    │  │addToast()│  │ results  │
│ volume   │  │ save()   │  │ []       │  │ motion   │  │open      │  │remove    │  │setQuery  │
│ timer    │  │ load()   │  │ add()    │  │ crossfade│  │right     │  │ Toast()  │  │ ()       │
│ toggle   │  │ delete() │  │ remove() │  │ timer    │  │Panel     │  │          │  │          │
│ Sound()  │  │          │  │          │  │ notifs+  │  │open      │  │          │  │          │
├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤
│persist:no│  │persist:  │  │persist:  │  │persist:  │  │persist:  │  │persist:  │  │persist:  │
│          │  │ yes      │  │ yes      │  │ yes      │  │ yes      │  │ no       │  │ no       │
└─────┬────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └──────────┘
      │
      ▼
┌──────────────┐
│ AudioEngine  │  (singleton, not a store)
│ (engine.ts)  │
├──────────────┤
│ AudioContext │
│ masterGain   │
│ soundMap     │
│ play/stop    │
│ fade/suspend │
└──────────────┘
```

## Data Flow: Playing a Sound

```
1. User clicks "Play" on SoundCard
2. SoundCard dispatches audioStore.toggleSound(soundId)
3. Audio Store:
   a. Calls audioEngine.init() (lazy AudioContext creation)
   b. Checks activeSounds size < MAX_CONCURRENT_SOUNDS (16)
   c. Calls audioEngine.resume() (user gesture requirement)
   d. Calls audioEngine.playSound(soundId)
   e. Updates isPlayingSounds Set, isPlaying flag
4. Audio Engine:
   a. Looks up sound builder from SOUND_BUILDERS map
   b. Creates oscillator/noise buffer nodes with linearRampToValueAtTime gain scheduling
   c. Connects to soundGain → masterGain → AudioContext.destination
   d. Registers sound in activeSounds Map
   e. Returns control to store
5. PlayerBar and RightPanel reactively update via zustand selectors
```

## Data Flow: Sleep Timer

```
1. User sets timer (e.g., 30 min)
2. Store records endTime, starts setInterval (1s)
3. Every tick: calculate remaining, update timerRemaining
4. Components render live MM:SS countdown
5. When remaining hits 0:
   a. audioEngine.fadeOutAll(30) — linearRampToValueAtTime over 30 seconds
   b. After fade, stopAll(), reset masterGain with setValueAtTime(0.8)
6. If all sounds stop manually before timer: auto-cancel
```

## Audio Engine Internals

```
audioEngine (singleton)
├── AudioContext (created on first init())
├── masterGainNode (controls global volume)
├── Map<string, SoundInstance>
│   ├── source: OscillatorNode | AudioBufferSourceNode | (interval)
│   ├── gainNode: GainNode
│   ├── extraNodes: BiquadFilterNode | LFO | etc.
│   └── cleanup: () => void
├── MAX_CONCURRENT_SOUNDS = 16
├── fadeTimer: timeout reference
│
├── init()          — create AudioContext, check/restore suspended state
├── resume()        — AudioContext.resume()
├── suspend()       — AudioContext.suspend()
├── playSound(id)   — instantiate sound graph from config (enforce ceiling)
├── stopSound(id)   — linearRamp fade, proper node stop + disconnect (block-scoped)
├── stopAll()       — stop all active sounds
├── fadeOutAll(sec) — ramp masterGain to 0 over N seconds, restore with setValueAtTime
├── cancelFade()    — cancel pending fadeOut
├── setVolume(id,v) — linearRampToValueAtTime individual sound gain
└── setMaster(v)    — linearRampToValueAtTime masterGainNode gain
```

## Component → Store Wiring

| Component | Stores Used | Key Selectors |
|-----------|------------|---------------|
| Sidebar | ui, settings, audio | sidebarOpen, theme, isPlaying |
| TopBar | ui | searchOpen, sidebarOpen |
| RightPanel | audio, mixer, ui | isPlayingSounds, layers, timerRemaining, rightPanelOpen |
| PlayerBar | audio, favorites, ui | isPlaying, isPaused, volume, timerRemaining, isPlayingSounds |
| SoundCard | audio, favorites | toggleSound, isSoundPlaying, isSoundFavorited |
| ExploreContent | audio, ui | toggleSound, playSound |
| MixerContent | mixer, audio | layers, presets, save, load |
| FavoritesContent | favorites, audio | sounds, collections, remove |
| ProfileContent | audio, favorites | isPlaying, favorites count |
| SettingsContent | settings | theme, reducedMotion, crossfade, timer, analytics |
| SearchContent | ui, audio | searchOpen, query |
| ToastContainer | toast | toasts, removeToast |
| QueuePanel | mixer, audio | layers, setLayers, volume, sounds |
| Toast (offline) | toast (via Providers) | addToast |
