# Noctune — Roadmap & Future Developments

## Phase 1: Foundation ✓ (Current)
- Static Next.js export deployed to Cloudflare Pages
- 60+ procedural sounds across 20+ categories (rain, ocean, thunder, wind, forest, triggers, etc.)
- Hero homepage with Three.js interactive orbs + environment selector
- Mixer page with multi-sound layering and individual volume sliders
- Player bar with per-sound pause/remove and sound picker
- Smart search with autocomplete and keyword mapping
- Sidebar with Quick Access (Continue Listening, Favorites, Quick Mixes) and Tools
- Premium badge system, favorites, collections
- 6-orb interactive hero scene (Rain, Forest, Fire, Ocean, Night, Wind)
- Desktop-first responsive layout

## Phase 2: Personalization & Persistence
- **User accounts** — anonymous guest → optional email sign-up
- **Listening history** — track what users play and for how long
- **Continue Listening** — resume last session's mix
- **Favorites sync** — persist across devices via cloud
- **Daily recommendation** — suggest a sound/mix based on time of day and history
- **"Returning user" greeting** — currently simulated with `Math.random()`, replace with real data

## Phase 3: Content Expansion
- **More trigger sounds** — add the full top-20 ASMR trend list:
  - Kinetic sand cutting
  - Slime mixing
  - Marble cascades
  - Candle wax pouring
  - Ice crushing
  - Mechanical keyboard variants
  - Watercolor painting
  - Calligraphy writing
  - Pottery wheel
  - Embroidery / thread work
- **Mood-based sound packs** — Sleep Pack, Focus Pack, ADHD Pack, Meditation Pack
- **User-requested sounds** — voting system for next procedural sound to build

## Phase 4: Social & Community
- **Shared mixes** — users can create and share custom sound layers via URL
- **Community playlists** — curated collections by other users
- **"Listen with"** — real-time sync with friends (WebRTC)
- **Sound of the day** — featured procedural sound with description

## Phase 5: Advanced Audio & UI
- **Procedural audio engine v2** — more realistic DSP:
  - Convolution reverb for spatial depth
  - Dynamic compressor for smooth blending
  - Stereo panning per sound layer
  - Parametric EQ per channel
- **Visualizer** — real-time waveform and spectrum display
- **Sleep timer** — fade-out with configurable duration (already in store, needs UI)
- **Crossfade presets** — smooth transitions between mixes
- **Ambient mode** — full-screen audio-only with dimmed UI for sleep

## Phase 6: Premium & Monetization
- **Premium tier**:
  - High-bitrate audio engine mode
  - Exclusive sounds (already partially tagged)
  - Unlimited layers in mixer (free tier cap at 4)
  - Advanced EQ and effects per channel
  - Export mixes as high-quality files
- **One-time purchases** — individual sound pack purchases
- **Subscription** — monthly/annual for full library access

## Phase 7: Platform Expansion
- **Mobile PWA** — installable with offline playback of cached mixes
- **Native iOS / Android wrapper** — via Capacitor or React Native
- **Desktop app** — Tauri wrapper with system tray and global hotkeys
- **Browser extension** — replace new tab with Noctune ambient page

## Phase 8: AI & Generative Features
- **AI mood detection** — suggest sounds based on time, weather, and usage patterns
- **Procedural sound mixing** — AI generates unique sound combinations based on user preferences
- **Voice commands** — "play rain", "set volume to 5", "sleep timer 30 minutes"
- **Adaptive audio** — sounds that subtly evolve over a session to prevent habituation

## Technical Debt & Infrastructure
- [ ] Add unit tests for audio engine (Jest + Web Audio mock)
- [ ] Add E2E tests for critical flows (play, pause, search, mixer)
- [ ] Set up CI/CD with automated preview deployments
- [ ] Migrate to Turborepo if monorepo needed for mobile/desktop apps
- [ ] Add proper error tracking (Sentry or similar)
- [ ] Performance budgets for Three.js scene (60fps on mid-range devices)
- [ ] Accessibility audit (keyboard nav, screen reader support, reduced motion)

## Metrics & Success Criteria
- **Engagement**: Avg session length > 20 min
- **Retention**: Day-7 return rate > 30%
- **Mixer usage**: > 40% of users create custom mixes
- **Sound library**: > 100 procedural sounds
- **Platform**: Available on web, mobile, desktop
