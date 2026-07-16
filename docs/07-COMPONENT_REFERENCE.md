# Noctune — Complete Component Reference

Every React component in the project, organized by domain. For each: file location, props interface, states, behavior, responsive notes, and which stores it consumes.

---

## Layout Components

### `Providers` (`src/components/layout/Providers.tsx`)
**Role:** Root layout wrapper. Initializes theme, keyboard shortcuts, offline detection. Provides ScrollContainerContext.

| Aspect | Detail |
|--------|--------|
| Stores | `useSettingsStore` (theme, reducedMotion), `useToastStore` (addToast) |
| Children | All route content via Next.js App Router |
| Theme | Reads `theme` from settings, sets `dark`/`light` class on `<html>`, listens for system theme changes. Applies `reduce-motion` class as well |
| Offline | Subscribes to `window.online`/`offline` events, dispatches toast notifications |
| Layout modes | Home page (`/`): `h-screen overflow-y-auto`, no sidebar/topbar/right panel. Other pages: `h-screen flex flex-col` with sidebar, content area, right panel, player bar, bottom nav |
| ScrollContainer | Exposes scroll container ref via `ScrollContainerContext` for hero wheel detection |

### `Sidebar` (`src/components/layout/Sidebar.tsx`)
**Role:** Desktop persistent sidebar / mobile slide-in drawer.

| Aspect | Detail |
|--------|--------|
| Props | None (reads all state from stores) |
| Stores | `useUiStore` (sidebarOpen, setSidebarOpen), `useSettingsStore` (theme, setTheme), `useAudioStore` (isPlaying, isPlayingSounds, playSingle), `useMixerStore` (presets, loadPreset) |
| Width | `w-[280px]` |
| States | Open/closed (`-translate-x-full` / `translate-x-0`, `z-50` on mobile) |
| Sections | Logo → Navigation (Home, Explore, Mixer, Favorites) → Now Playing mini-card → Presets list → Theme toggle → Premium upsell card → Settings link |
| Responsive | `< lg:` Fixed overlay with backdrop (`z-40 bg-black/60`), slide-in animation (500ms transition) |
| Touch targets | Nav items: `py-2.5` (~40px), Theme toggle: `px-2.5 py-1.5` (~24px) |
| Loading | Returns `null` if store not hydrated (`useStoreHydration`) |

### `TopBar` (`src/components/layout/TopBar.tsx`)
**Role:** Top navigation bar with search trigger, hamburger menu, and action buttons.

| Aspect | Detail |
|--------|--------|
| Stores | `useUiStore` (setSidebarOpen, setSearchOpen) |
| States | Scroll-aware (adds `bg-bg-secondary/80 backdrop-blur-xl` border when scrolled > 0) |
| Sections | Hamburger button (`lg:hidden`) → Search bar (click opens SearchContent overlay) → Notification bell → Profile avatar |
| Responsive | Search bar `max-w-[600px]`; hamburger hidden at `lg:`; profile section visible at all sizes |
| Touch targets | Hamburger/notification buttons: `h-9 w-9` (36px) |

### `RightPanel` (`src/components/layout/RightPanel.tsx`)
**Role:** Desktop right panel / mobile bottom sheet showing current mix details.

| Aspect | Detail |
|--------|--------|
| Stores | `useUiStore` (rightPanelOpen, setRightPanelOpen), `useAudioStore` (isPlayingSounds, isPlaying, isPaused, progress, volume, setMasterVolume, timerRemaining, timerMinutes), `useMixerStore` (layers) |
| Width | Desktop: `w-[360px]`, Mobile: bottom sheet `max-h-[70vh]` |
| States | Open/closed; desktop is `translate-x-0`/`translate-x-full`; mobile slides up from bottom |
| Sections | Header → Active sounds list with per-sound volume sliders → Master volume → Sleep timer controls |
| Z-index | `z-50` on mobile |
| Notes | Always mounted but transforms off-screen when closed |

### `BottomNav` (`src/components/layout/BottomNav.tsx`)
**Role:** Mobile-only bottom navigation with 5 items.

| Aspect | Detail |
|--------|--------|
| Props | None |
| Visibility | `lg:hidden` |
| Height | `h-16` (64px) |
| Items | Home, Explore, Mixer, Favorites, Profile (each with Lucide icon + `text-[10px]` label) |
| Active state | Uses `usePathname()` — active item gets `text-accent-light`, others get `text-text-quaternary` |
| Touch targets | Each item is a `Link` with `px-3 py-1` padding; icon is 20px |

---

## Player Components

### `PlayerBar` (`src/components/player/PlayerBar.tsx`)
**Role:** Bottom player bar with playback controls, progress, volume, and utility buttons.

| Aspect | Detail |
|--------|--------|
| Stores | `useAudioStore` (all playback state), `useUiStore` (setRightPanelOpen, setAmbientMode) |
| Height | `h-[72px] md:h-[82px] lg:h-[92px]` |
| Sections | **Left** (`w-[200px] lg:w-[280px]`): Track thumbnail (40x40 on mobile, 56x56 on desktop) → Title (mobile: `max-w-[120px]`, desktop: full with category label) → Sound picker dropdown → **Center** (`flex-1`): Play/Pause button, Skip stop, Progress bar (elapsed / total) → **Right** (`w-auto lg:w-[280px]`): Volume slider (desktop only, `lg:hidden`), ListMusic button (`lg:hidden`), Sleep timer dropdown, Ambient mode toggle |
| Timer dropdown | 15/30/45/60/120 min options + Cancel; shows remaining countdown on button when active |
| Sound picker | Dropup list of all currently playing sounds with per-sound play/pause and remove buttons |
| States | Empty state (dimmed buttons, "No sounds playing"), Playing state (full color, active controls), Timer active (accent-colored timer badge) |

### `AmbientOverlay` (`src/components/player/AmbientOverlay.tsx`)
**Role:** Full-screen immersive ambient mode for distraction-free listening.

| Aspect | Detail |
|--------|--------|
| Stores | `useUiStore` (ambientMode, setAmbientMode), `useAudioStore` (isPlaying, isPaused, isPlayingSounds, volume, setMasterVolume, togglePause, timerRemaining, timerMinutes) |
| Trigger | Moon icon in PlayerBar |
| Z-index | `z-50` |
| Behavior | Full-screen dark gradient; auto-hides cursor after 3s (mousemove/touchstart shows it); ESC or click-outside to exit; Space to toggle play/pause |
| Sections | Exit button (top-right) → Timer badge (top-left, optional) → Category/sound name → Play/Pause button (h-16 w-16) → Volume slider (max-w-xs) → "Press ESC to exit" hint (bottom) |
| Responsive | Sound title: `text-4xl sm:text-5xl md:text-6xl`, Play button: `h-16 w-16 sm:h-20 sm:w-20` |

### `QueuePanel` (`src/components/player/QueuePanel.tsx`)
**Role:** Drag-and-drop queue reorder for active sounds.

| Aspect | Detail |
|--------|--------|
| Stores | `useMixerStore` (layers, setLayers, removeLayer, setLayerVolume), `useAudioStore` (isPlayingSounds, isPlaying, isPaused, togglePause) |
| Interaction | framer-motion `Reorder.Group` for drag-and-drop reordering (desktop only) |
| Sections | Header → List of sounds with drag handle, icon, title, mute button, volume slider, remove button |

---

## UI Components

### `SoundCard` (`src/components/ui/SoundCard.tsx`)
**Role:** Primary sound display component used in grids across Explore, Favorites, Mixer, and Home pages.

| Aspect | Detail |
|--------|--------|
| Props | `id, title, description, gradient, duration, category?, coverUrl?, isPremium?, className?, onClick?` |
| Stores | `useAudioStore` (playSingle, toggleSound, isSoundPlaying), `useFavoritesStore` (toggleSound, isSoundFavorited) |
| States | Playing (shows "Playing" badge + green play button), Paused, Favorited (red heart), Premium locked (gold badge), Image failed (falls back to gradient + Music icon), Hovered (card lifts, play button appears, heart appears) |
| States (continued) | On touch without hover: play button and heart are always invisible for non-playing tracks; only visible when playing. Tapping card triggers play (via `onClick`). |
| Layout | Aspect-square artwork → Title (truncate) → Description (truncate) → Duration badge + Category label |
| Touch | Play button `h-11 w-11` (44px, meets WCAG AA minimum), Heart button `h-11 w-11` |
| Image | Unsplash URLs; loads via `<img>` with `onError` fallback; lazy loading |

### `Slider` (`src/components/ui/Slider.tsx`)
**Role:** Custom range slider used for volume, crossfade, and per-sound levels.

| Aspect | Detail |
|--------|--------|
| Props | `value, onChange, min?, max?, step?, className?, size?` ("sm" \| "md" \| "lg") |
| Behavior | Shows linear gradient fill proportional to value; thumb is 14x14px, colored with accent. On desktop (hover-capable): thumb hidden until hover. On touch devices: thumb always visible. |
| Sizes | `sm: h-1` (1px track), `md: h-1.5`, `lg: h-2` |
| States | Default, Active (on hover, thumb scales 1.2x), Dragging |

### `KeyboardShortcutsHelp` (`src/components/ui/KeyboardShortcutsHelp.tsx`)
**Role:** Modal displaying all keyboard shortcuts. Triggered by `?` key.

| Aspect | Detail |
|--------|--------|
| Stores | `useUiStore` (helpOpen, setHelpOpen) |
| Sections | Header "Keyboard Shortcuts" → Grouped shortcut list: Playback (Space, M), Navigation (↑/↓, S, L, A, /), Sounds (N, F, R), Interface (?, B) |
| Interaction | ESC closes; backdrop click closes |

### `ToastContainer` (`src/components/ui/ToastContainer.tsx`)
**Role:** Fixed toast notification display.

| Aspect | Detail |
|--------|--------|
| Stores | `useToastStore` (toasts, removeToast) |
| Position | Fixed bottom-right (`bottom-36 right-6`), z-60 |
| Types | success (green), error (red), warning (yellow), info (blue) |
| Layout | Each toast: icon → title + description → optional action button → close button |
| Responsive | `min-w-[300px] max-w-[400px]` — on smaller phones this may overflow |
| Auto-dismiss | Default 4000ms, configurable per toast |

### `Tabs` (`src/components/ui/Tabs.tsx`)
**Role:** Segmented tab selector used in Settings and other filter contexts.

| Props | `tabs: {id, label}[], active, onChange, variant?` |
| Behavior | Click to select; active tab gets accent styling |

### `Toggle` (`src/components/ui/Toggle.tsx`)
**Role:** iOS-style on/off toggle switch.

| Props | `checked, onChange, disabled?` |
| Behavior | Smooth sliding pill; accent color when on, glass color when off |

### `Modal` (`src/components/ui/Modal.tsx`)
**Role:** Generic modal/dialog overlay.

| Props | `open, onClose, title, children` |
| Z-index | z-50 |
| Behavior | Backdrop click closes; ESC closes; framer-motion enter/exit animation |

### `Button` (`src/components/ui/Button.tsx`)
**Role:** Reusable button with variant system.

| Props | `variant?` ("primary" \| "secondary" \| "ghost"), `size?`, `children, onClick, disabled?, className?` |
| Variants | primary (accent background), secondary (glass border), ghost (transparent) |

### `GlassCard` (`src/components/ui/GlassCard.tsx`)
**Role:** Frosted glass container card.

| Props | `children, className?` |
| Notes | Uses `bg-glass` with backdrop-blur, rounded-3xl, border-border-subtle |

### `Dropdown` (`src/components/ui/Dropdown.tsx`)
**Role:** Popover dropdown menu.

| Props | `items, trigger, align?` |
| Position | `top-full` with configurable alignment; `min-w-[180px]` |
| Items | Each item: icon + label + optional keyboard shortcut |

### `Chip` (`src/components/ui/Chip.tsx`)
**Role:** Small label/tag chip.

| Props | `label, active?, onClick?, onRemove?, size?` |
| Variants | Default (glass), Active (accent), Removable (with X icon) |

### `EmptyState` (`src/components/ui/EmptyState.tsx`)
**Role:** Empty state placeholder with icon, title, description, optional action.

| Props | `icon, title, description, action?` |
| Usage | Favorites, Mixer, Search (no results) |

### `Equalizer` (`src/components/ui/Equalizer.tsx`)
**Role:** Animated audio visualizer bars (5 bars with CSS animation).

| Props | `active?, size?` |
| Behavior | Static when inactive; bouncing animation when active (via `eq-bar` CSS classes) |

### `Visualizer` (`src/components/ui/Visualizer.tsx`)
**Role:** Waveform visualizer using canvas (AnalyserNode integration).

| Props | `analyserNode?, active?, barCount?, color?` |
| State | Draws live frequency data when analyserNode provided; static when inactive |

### `Waveform` (`src/components/ui/Waveform.tsx`)
**Role:** Static waveform preview image for sounds.

| Props | `soundId, className?` |
| Notes | Renders a canvas-based waveform from sound sample data |

### `Card` (`src/components/ui/Card.tsx`)
**Role:** General-purpose content card.

| Props | `children, variant?, padding?, onClick?, hoverable?, className?` |
| Variants | default (glass), elevated (border + shadow), interactive (hover lift) |

### `TextInput` (`src/components/ui/TextInput.tsx`)
**Role:** Styled text input with optional icon, label, error state.

| Props | `value, onChange, placeholder?, icon?, label?, error?, type?` |

---

## Page Content Components

### `HeroOverlay` (`src/components/hero/HeroOverlay.tsx`)
**Role:** Hero section overlay with text, CTAs, and environment controls.

| Aspect | Detail |
|--------|--------|
| Stores | `useAudioStore` (isSoundPlaying, playSingle, stopSound) |
| States | Active orb (shows orb copy headline/subhead), Active environment, Scrolled (hides scroll indicator) |
| Sections | Nav (logo + desktop links) → Headline (rotating 3 headlines, 6s interval, or custom on orb click) → Subhead → CTA buttons (Start Listening, Explore Library) → Right panel (desktop, `hidden lg:flex`) with Now Playing card + vertical env selector → Mobile env strip (`lg:hidden`, horizontal, `bottom-20`) → Scroll indicator (desktop, disappears on scroll) |
| Time-aware | Greeting changes (Good Morning/Afternoon/Evening); ambient warmth adjusts via `timeWarmth` |
| Animations | framer-motion stagger entrance (0.15s per child), AnimatePresence headline transitions |

### `Hero3D` (`src/components/hero/Hero3D.tsx`)
**Role:** Three.js 3D scene with environments, orbs, and interactive elements.

| Aspect | Detail |
|--------|--------|
| Props | `env?, activeOrb?, hoveredOrb?, onOrbClick, onOrbHover, timeWarmth` |
| Rendering | Canvas with `dpr={[1, 1.5]}` on mobile, `[1, 2]` on desktop. Auto-degrades to static gradient fallback on low-power mobile devices (checks `navigator.hardwareConcurrency <= 4 && /Mobi/.test(navigator.userAgent)`) |
| Scene | Mountain range (10 peaks with custom geometry), Stars (500 points), Ground plane, Fog (soft atmospheric), Aurora (drifting gradient), Fireflies (animated sprites with random orbits) |
| Orbs | 6 interactive glass spheres with labels (Rain, Forest, Fire, Ocean, Night, Wind). Each orb: hover effect (glow + scale), click effect (glow ring + headline change), smooth rotation animation with floating motion |
| Environments | 7 environments: rainforest, forest, ocean, campfire, snow, night, desert — each changes scene colors, fog density, particle effects |
| Responsive | On mobile/low-end: replaces 3D with static gradient background (no Three.js render) |

### `HomeContent` (`src/components/home/HomeContent.tsx`)
**Role:** Home page content below the hero fold.

| Sections | MoodPicker, EnvironmentsCarousel, StatsSection, MiniMixer |
| Scroll | The hero wheel event handler (`handleHeroWheel`) scrolls the container |
| States | `returnVisit` (random 50% chance: shows returning visitor greeting) |

### `ExploreContent` (`src/components/explore/ExploreContent.tsx`)
**Role:** Sound browser with search + category filter.

| Aspect | Detail |
|--------|--------|
| Stores | None directly (SoundCard reads its own stores) |
| Search | Input with keyword matching (KEYWORD_MAP: 31 keyword categories) + autocomplete suggestions |
| Category | 30+ categories rendered as horizontally scrollable chip pills |
| Grid | Responsive: 2 → 3 → 4 → 5 → 6 → 7 columns |

### `MixerContent` (`src/components/mixer/MixerContent.tsx`)
**Role:** Layer-based sound mixer.

| Stores | `useMixerStore` (all mixer state), `useAudioStore` (toggleSound, isSoundPlaying) |
| Max layers | 10 |
| Presets | Save/load/delete/rename/duplicate — persisted in localStorage |

### `FavoritesContent` (`src/components/favorites/FavoritesContent.tsx`)
**Role:** Display saved sounds and collections.

| Stores | `useFavoritesStore` (soundIds, savedCollections, clearAll), `useAudioStore` |
| Sections | Sound grid (2-4 columns) → Collection cards → Empty state |

### `ProfileContent` (`src/components/profile/ProfileContent.tsx`)
**Role:** User profile with stats and quick actions.

| Sections | Avatar + name + join date → Stats (sounds played, listening hours, favorites) → Quick settings (theme, timer) → Navigation links |

### `SettingsContent` (`src/components/profile/SettingsContent.tsx`)
**Role:** Multi-tab settings panel.

| Stores | `useSettingsStore` (all settings state) |
| Tabs | Appearance, Audio, Playback, Privacy (segmented via `Tabs` component) |
| Persistence | All settings persisted via zustand/persist |

### `SearchContent` (`src/components/search/SearchContent.tsx`)
**Role:** Full-screen search overlay with autocomplete and results.

| Stores | `useUiStore` (searchOpen, setSearchOpen, recentSearches, addRecentSearch, clearRecentSearches) |
| Z-index | z-50 |
| Behavior | Auto-focuses input on open; keyboard navigation (↑↓ arrows, Enter, Escape); resets query/selected index on each open |
| Sections | Search input → Autocomplete suggestions → Results (SoundCard grid) → No results (with tag suggestions) → Default state (Recent Searches + Trending Sounds) |
| Recent searches | Persisted in ui-store, max 10, "Clear All" button |

---

## Collection / Misc Components

### `CollectionCard` (`src/components/collections/CollectionCard.tsx`)
**Role:** Card for saved/curated collections of sounds.

| Props | `id, name, description, soundCount, coverUrl?, gradient, sounds[]` |
| States | Normal, Playing (shows play button), Hovered (card lifts, play button appears) |
| Issues | Play button only visible on hover — not visible on touch devices |

### `FloatingControls` (`src/components/hero/FloatingControls.tsx`)
**Role:** Floating action buttons on the hero page (volume, theme, fullscreen).

| Position | `fixed bottom-24 right-6 z-40` |
| Stores | `useAudioStore`, `useSettingsStore` |
| Controls | Volume (slider), Theme toggle, Fullscreen toggle, Ambient mode |
| Visibility | `lg:hidden` on desktop (player bar has these controls) |

### `EnvironmentSelector` (`src/components/hero/EnvironmentSelector.tsx`)
**Role:** Horizontal scrollable environment pill selector for mobile.

| Props | `environments[], activeId, onSelect` |
| Behavior | Horizontal scroll with hidden scrollbar; left/right arrow buttons on hover (desktop only) |

### `ExploreButton` (`src/components/hero/ExploreButton.tsx`)
**Role:** Floating "Start Exploring" button on hero page, changes to "Back to Top" on scroll.

| Position | `fixed z-50`, animated position changes based on scroll state |
| Stores | `useScrollScrolled` |
| States | Not scrolled: bottom-center. Scrolled: bottom-right as compact "Back to Top" |

---

## Data Components (Non-React)

### `sounds.ts` (`src/data/sounds.ts`)
**Role:** Sound data catalogue. 62 sounds across 31 categories.

| Export | Type | Description |
|--------|------|-------------|
| `sounds` | `Sound[]` | Array of all sound objects |
| `categoryLabels` | `Record<string, string>` | Display labels for each category |
| `categoryIcons` | `Record<string, string>` | Lucide icon name for each category |
| `getSoundById(id)` | `Sound \| undefined` | Lookup by ID |
| `getSoundsByCategory(cat)` | `Sound[]` | Filter by category |
| `getFeaturedSounds()` | `Sound[]` | Non-premium sounds (first 12) |
| `getPremiumSounds()` | `Sound[]` | All premium sounds |

### `audio/engine.ts` (`src/audio/engine.ts`)
**Role:** Procedural audio generation engine (singleton).

| Method | Description |
|--------|-------------|
| `init()` | Creates AudioContext on first call; resumes if suspended |
| `resume()` / `suspend()` | AudioContext lifecycle |
| `playSound(id, volume)` | Builds sound graph from SOUND_BUILDERS map, connects to master gain |
| `stopSound(id)` | Fades out with linear ramp, disconnects nodes, removes from active map |
| `stopAll()` | Stops all active sounds |
| `fadeOutAll(seconds)` | Ramps masterGain to 0 over N seconds, then stops all and restores gain |
| `cancelFade()` | Cancels pending fade-out |
| `setSoundVolume(id, v)` | Per-sound volume with linear ramp |
| `setMasterVolume(v)` | Global volume with linear ramp |
| `destroy()` | Tears down AudioContext and all connections |

Sound generation uses: `OscillatorNode`, `AudioBufferSourceNode` (noise buffers), `GainNode`, `BiquadFilterNode`, `setInterval` for textures, LFO modulation, scheduled chirps/clicks/crackles.
