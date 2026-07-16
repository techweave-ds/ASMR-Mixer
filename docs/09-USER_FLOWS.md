# Noctune — User Flows & Usage Scenarios

This document describes how a real person uses Noctune from start to finish: every interaction path, decision point, and system response.

---

## Quick Start (First Visit)

```
1. LANDS ON HERO PAGE (/)
   │
   ├─ Sees: 3D mountain scene with floating glass orbs
   │        Rotating headline: "Escape the Noise."
   │        Greeting: "Good Morning/Afternoon/Evening"
   │        CTA buttons: "Start Listening" / "Explore Library"
   │
   ├─ Hovers orb → orb glows, shows label
   ├─ Clicks orb → plays sound, headline changes to orb copy
   │        "Now Playing" card appears in right panel
   │
   ├─ Clicks environment pill (Rainforest, Ocean, etc.)
   │        Plays that environment's primary sound
   │
   ├─ Scrolls down → hero fades out, content sections appear
   │        Mood Picker → Environment Carousel → Stats → Mini Mixer
   │
   └─ CTA: "Start Listening" → navigates to /explore
```

## Common User Scenarios

### Scenario 1: Focused Work Session

```
GOAL: Block out distractions for 2 hours of deep work

1. Open Noctune, navigate to /explore via sidebar or "Start Listening" CTA
2. Type "focus" in search bar → autocomplete suggests keyword match
3. See filtered results: white noise, brown noise, café, library
4. Click "Brown Noise" SoundCard → sound starts immediately
5. PlayerBar appears at bottom with playback controls
6. Want more layers: navigate to /mixer
7. Click "Add Sound" → select "Rain on Rooftop" → both sounds play simultaneously
8. Adjust per-sound volume sliders in Mixer
9. Set sleep timer for 2 hours → timer badge shows countdown
10. Work for 2 hours → sounds fade out over 30 seconds at timer expiry
```

**System actions:**
- `audioEngine.init()` creates AudioContext
- `audioEngine.playSound("brown-noise")` generates brown noise buffer
- zustand updates `isPlayingSounds` Set
- PlayerBar reactively renders with progress bar
- Timer interval ticks every 1s, updating `timerRemaining`
- At 0: `audioEngine.fadeOutAll(30)` ramps master gain

### Scenario 2: Falling Asleep

```
GOAL: Drift off to ambient sounds, auto-stop after 30 minutes

1. From home page, click "Night Sky" environment pill
   → Plays night crickets sound
2. Click Moon icon in PlayerBar → Ambient Mode activates
   → Full-screen dark overlay, cursor hides after 3s
3. See large sound name "Summer Crickets" centered
4. Set timer via exit to PlayerBar → 30 min
5. Flip to side, close eyes
6. 30 minutes later: sounds fade out over 30 seconds
7. Phone screen off (no need to wake to stop)
```

**System actions:**
- `ambientMode` set to `true` in ui-store
- CSS cursor-none applied; mousemove/touchstart resets 3s timer
- At timer expiry: `fadeOutAll(30)` then `stopAll()`

### Scenario 3: Morning Coffee & Reading

```
GOAL: Gentle background atmosphere while reading

1. Navigate to /explore
2. Click "Café" category chip
3. See Bustling Café, Rainy Café Window
4. Play "Bustling Café" → coffee shop ambience
5. Add "Pages Turning" from search (type "page" → find Pages Turning)
6. Adjust Café volume to 40%, Pages to 70%
7. Open right panel to see both layers with sliders
8. Read in peace
```

### Scenario 4: Exploring & Discovering

```
GOAL: Browse available sounds, find new favorites

1. Navigate to /explore
2. Scroll horizontally through 30 category chips (Rain, Thunder, Wind, Forest...)
3. Click different categories to filter
4. Hover SoundCards → preview lifts, play button appears
5. Click play → sound starts immediately
6. Click Heart → favorites the sound
7. Navigate to /favorites → see all liked sounds
8. Click any favorite to play instantly
```

### Scenario 5: Building a Custom Mix

```
GOAL: Create a layered soundscape and save it as a preset

1. Navigate to /mixer
2. Click "Add Sound" → browse available sounds in grid
3. Add "Light Rain" → first layer appears
4. Add "Gentle Breeze" → second layer
5. Add "Fireplace" → third layer
6. Adjust each layer's volume slider:
   - Rain: 60%
   - Breeze: 30%
   - Fireplace: 45%
7. Click "Save Mix" → type "Rainy Evening" → Save
8. Later: load preset from sidebar "Presets" section
9. All 3 layers restore with saved volumes
```

**Data flow:**
- Layers stored in `useMixerStore` (persisted)
- Presets stored in `mixer-store.presets` (persisted to localStorage `noctune-mixer-storage`)
- Loading a preset: `loadPreset(id)` restores layers + masterVolume

### Scenario 6: Premium User Experience

```
GOAL: Access premium-only sounds and support the product

1. See premium sounds marked with gold "Premium" badge
2. Example premium sounds: Rain & Thunder, Deep Woods, Ocean Storm,
   Tropical Birds, Blue Noise, Cellophane Crinkle
3. Clicking a locked premium sound:
   → Toast notification: "Upgrade to Noctune Premium to unlock"
4. Premium user (via future auth/stripe integration):
   → `useEntitlementStore.isPremium = true`
   → All sounds unlock
   → Premium badge shows as owned
```

### Scenario 7: Keyboard Power User

```
GOAL: Navigate and control playback entirely via keyboard

SHORTCUT    ACTION
─────────────────────────────────────
?           Open keyboard shortcuts help modal
↑/↓         Increase/decrease volume
Space       Toggle play/pause
M           Mute toggle toast
S           Toggle sidebar
A           Toggle ambient mode
F           Toggle favorite current sound
N           Stop current/last sound
R           Toggle layers panel
Escape      Cascade: close search → close sidebar → close right panel
```

### Scenario 8: Mobile User

```
GOAL: Use Noctune on a phone during commute

1. Open on mobile (320-768px width)
2. See hero (full viewport) with:
   - Smaller headline (text-3xl)
   - Horizontal env strip at bottom with emoji icons
   - Stacked CTA buttons
3. Scroll past hero to see home sections
4. BottomNav visible with 5 tabs:
   Home, Explore, Mixer, Favorites, Profile
5. Tap Explore → category chips scroll horizontally
6. Sound grid shows 2 columns
7. Tap SoundCard → sound plays
8. PlayerBar appears at bottom (72px height)
9. Tap ListMusic icon → right panel opens as bottom sheet
10. Tap timer icon → set sleep timer
11. Tap Moon icon → ambient mode (full screen, cursor-less)
```

---

## State Machine: Playback Lifecycle

```
IDLE
  │
  ├─ User clicks Play
  ▼
INITIALIZING
  │  audioEngine.init() → create AudioContext
  │  audioEngine.playSound(id) → build sound graph
  ▼
PLAYING (isPlaying: true, isPaused: false)
  │
  ├─ User clicks same sound → stop + clean up → IDLE
  ├─ User clicks Pause → audioEngine.suspend()
  │                       └── PAUSED
  │                            ├─ User clicks Play → audioEngine.resume()
  │                            │                     └── PLAYING
  │                            └─ User clicks Stop → IDLE
  ├─ User clicks another sound → add layer (up to 16)
  │                              └── PLAYING (multi-layer)
  ├─ Timer expires → fadeOutAll(30s) → stopAll → IDLE
  ├─ User clicks Stop All → stopAll → IDLE
  └─ User closes browser → AudioContext garbage collected
```

---

## Navigation State Machine

```
    ┌──────────────────────────────────────┐
    │              HOME (/)                │
    │  Hero → MoodPicker → Carousel →     │
    │  Stats → MiniMixer → PlayerBar      │
    └────────┬─────────────────────────────┘
             │
    ┌────────▼────────┐    ┌──────────────┐
    │   EXPLORE       │    │   MIXER      │
    │  Search + Grid  │◄──►│  Layers +    │
    │  Category chips │    │  Presets     │
    └────────┬────────┘    └──────┬───────┘
             │                    │
    ┌────────▼────────┐    ┌──────▼───────┐
    │   FAVORITES     │    │   SETTINGS   │
    │   Saved sounds  │    │  4 tabs      │
    └────────┬────────┘    └──────────────┘
             │
    ┌────────▼────────┐
    │   PROFILE       │
    │  Stats + links  │
    └─────────────────┘
```

Navigation via: Sidebar (desktop), BottomNav (mobile), keyboard shortcuts, or in-page links.

---

## Error States & Edge Cases

| Scenario | System Behavior | User Sees |
|----------|----------------|-----------|
| No sounds playing | PlayerBar dimmed, "No sounds playing" text | Dimmed play button, empty progress bar |
| All sounds stopped | isPlayingSounds Set empty, progress reset to 0 | PlayerBar returns to empty state |
| Browser tab hidden | AudioContext may suspend depending on browser | On return: audio may be paused (browser behavior) |
| AudioContext suspended (auto) | `init()` calls `resume()`, restores playback | Brief silence, then audio resumes |
| 16+ sounds attempted | Soft ceiling — new sound rejected | Sound doesn't play (no error feedback yet) |
| Timer expires mid-playback | `fadeOutAll(30)` over 30s, then `stopAll()` | Gradual volume decrease to silence |
| Network offline | Toast: "You're offline" | Warning toast, core audio still works (no streaming) |
| Network back online | Toast: "Back online" | Success toast |
| Image load failure | `onError` handler, shows gradient + Music icon | Gradient background replaces missing image |
| Premium sound (no subscription) | `isLocked()` returns true | Toast: "Upgrade to Noctune Premium" |
| 404 route | `not-found.tsx` renders | Gradient 404 page with "Go Home" link |
| React error | `error.tsx` error boundary renders | "Something went wrong" + error details + "Try Again" button |
| Hydration mismatch | zustand `persist` delays render until hydrated | Quick flash, then content appears |
| Low-power mobile GPU | Hero3D checks `hardwareConcurrency <= 4 && /Mobi/` | Static gradient fallback (no 3D) |

---

## Personas & Use Cases

### Alex — Software Engineer (Focus)
- Uses brown noise + rain layers 8 hours daily
- Keyboard shortcuts for everything
- Saves favorite mixes as presets
- Never uses ambient mode (needs to see code)

### Maya — Yoga Instructor (Meditation)
- Uses space drone + ocean waves for sessions
- Sets 45-minute timers for classes
- Uses ambient mode during practice
- Prefers light theme for daytime use

### James — Night-Shift Worker (Sleep)
- Uses fireplace + night crickets to fall asleep
- Sets 30-minute sleep timer every night
- Uses mobile in bed (ambient mode)
- Has 10+ favorite sounds saved

### Priya — Student (Study)
- Uses café + keyboard sounds for study sessions
- Explores new sounds weekly
- Uses search with keywords like "adhd", "focus"
- Never uses mixer (plays single sounds only)
