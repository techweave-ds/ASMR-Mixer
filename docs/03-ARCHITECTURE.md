# Noctune — Architecture & Data Flow

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js App Router                    │
│  /  /explore  /mixer  /favorites  /profile  /settings   │
├─────────────────────────────────────────────────────────┤
│                    Providers (layout)                    │
│  ┌─────────┬─────────────────────┬──────────────┐       │
│  │ Sidebar │  <main>             │ RightPanel   │       │
│  │ 280px   │  (content, scroll)  │ 360px        │       │
│  ├─────────┴─────────────────────┴──────────────┤       │
│  │              PlayerBar (92px)                 │       │
│  ├──────────────────────────────────────────────┤       │
│  │              BottomNav (mobile)               │       │
│  └──────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

## Two Layout Modes

| Page | Layout | Description |
|------|--------|-------------|
| `/` (Home) | Immersive | Full-screen hero, no sidebar/topbar/rightpanel, `overflow-y-auto` |
| All other pages | App shell | Sidebar \| content+topbar \| right panel + player bar |

## Component Hierarchy

```
Providers (wraps all routes)
├── ToastContainer (fixed bottom-right, z-60)
├── SearchContent (full-screen overlay, toggled via ⌘K)
│
├── [HOME PAGE] ─── div.h-screen.overflow-y-auto
│   ├── Hero3D (Three.js canvas, 100vh)
│   ├── HeroOverlay (text overlays, entrance sequence)
│   ├── HomeContent (scroll narrative sections)
│   ├── PlayerBar (always at bottom)
│   └── BottomNav (mobile only)
│
└── [OTHER PAGES] ─── div.h-screen.flex
    ├── Sidebar (280px, nav + library + collections)
    ├── div.flex-1
    │   ├── TopBar (scroll-aware frosted glass)
    │   └── main (overflow-y-auto, AnimatePresence pages)
    └── RightPanel (360px, always mounted, closable)
    │
    ├── PlayerBar (always at bottom, 92px)
    └── BottomNav (mobile only)
```

## Page → Content Component Mapping

| Route | Content Component | Description |
|-------|-------------------|-------------|
| `/` | Hero3D + HeroOverlay + HomeContent | Full-screen 3D hero + narrative scroll |
| `/explore` | ExploreContent | Sound browser with filters, categories |
| `/mixer` | MixerContent | Layer mixer with save/load presets |
| `/favorites` | (direct rendering) | Saved sounds and collections |
| `/profile` | ProfileContent | Account, preferences, usage stats |
| `/settings` | SettingsContent | Appearance, Audio, Playback, Privacy (Vol 3 §17) |

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
│ Sound()  │  │          │  │          │  │ notifs   │  │          │  │          │  │          │
├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤  ├──────────┤
│persist:no│  │persist:yes│  │persist:  │  │persist:  │  │persist:  │  │persist:no│  │persist:no│
│          │  │          │  │ yes      │  │ yes      │  │ yes      │  │          │  │          │
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
   b. Calls audioEngine.resume() (user gesture requirement)
   c. Calls audioEngine.playSound(soundId)
   d. Updates isPlayingSounds Set, isPlaying flag
4. Audio Engine:
   a. Looks up sound config from sounds.ts
   b. Creates oscillator/noise buffer nodes
   c. Connects to gain node → masterGain → AudioContext.destination
   d. Returns control to store
5. PlayerBar and RightPanel reactively update via zustand selectors
```

## Data Flow: Sleep Timer

```
1. User sets timer (e.g., 30 min)
2. Store records endTime, starts setInterval (1s)
3. Every tick: calculate remaining, update timerRemaining
4. Components render live MM:SS countdown
5. When remaining hits 0:
   a. audioEngine.fadeOutAll(30) — 30-second volume fade
   b. After fade, stop all sounds, clear timer
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
├── currentSoundId: string | null
├── fadeTimer: timeout reference
│
├── init()          — create AudioContext if missing
├── resume()        — AudioContext.resume()
├── suspend()       — AudioContext.suspend()
├── playSound(id)   — instantiate sound graph from config
├── stopSound(id)   — disconnect + cleanup nodes
├── stopAll()       — stop all active sounds
├── fadeOutAll(sec) — ramp gain to 0 over N seconds, then stop
├── cancelFade()    — cancel pending fadeOut
├── setVolume(id,v) — set individual sound gain
└── setMaster(v)    — set masterGainNode gain
```

## Component → Store Wiring

| Component | Stores Used | Key Selectors |
|-----------|------------|---------------|
| Sidebar | ui, settings, audio | sidebarOpen, theme, isPlaying |
| TopBar | ui | searchOpen |
| RightPanel | audio | isPlayingSounds, timerRemaining, volume |
| PlayerBar | audio | isPlaying, isPaused, volume, timerRemaining |
| SoundCard | audio, favorites | toggleSound, isSoundPlaying, favorites |
| ExploreContent | audio, ui | toggleSound, playSound |
| MixerContent | mixer, audio | layers, presets, save, load |
| SettingsContent | settings | theme, reducedMotion, crossfade, timer |
| SearchContent | ui, audio | searchOpen, query |
| ToastContainer | toast | toasts, removeToast |
