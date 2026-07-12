# Noctune — Roadmap & Future Developments

## Phase 1: Foundation ✓ (Complete — maintained)
- Static Next.js export deployed to Cloudflare Pages
- 62 procedural sounds across 31 categories (rain, ocean, thunder, wind, forest, triggers, etc.)
- Hero homepage with Three.js interactive orbs + environment selector
- Mixer page with multi-sound layering and individual volume sliders
- Player bar with per-sound pause/remove and sound picker
- Smart search with autocomplete and keyword mapping
- Sidebar with Quick Access (Continue Listening, Favorites, Quick Mixes) and Tools
- Premium badge system, favorites, collections
- 6-orb interactive hero scene (Rain, Forest, Fire, Ocean, Night, Wind)
- Mobile responsive — hero headline/CTA stacking, PlayerBar collapsible sections, touch targets, nav/logo sizing, section padding consistency
- Full design system token set (Volume 2), glassmorphism, motion variables
- 7 Zustand stores (5 persisted), 3 custom hooks
- Accessibility (aria-labels, keyboard nav, reduced-motion)
- SEO (per-route metadata, sitemap, robots.txt, OG/Twitter cards)

## Phase 2: Personalization & Persistence ⚡ (Partially started)
- **Listening history** — track what users play and for how long
- **Continue Listening** — resume last session's mix
- **Favorites sync** — persist across devices via cloud
- **Daily recommendation** — suggest a sound/mix based on time of day and history
- **"Returning user" greeting** — currently simulated with `Math.random()` in `HomeContent.tsx:43`, replace with real data
- **User accounts** — anonymous guest → optional email sign-up (deferred to Phase 6)

## Phase 3: Content Expansion 🔄 (In progress)
- **12 new sounds added Jul 2026**: Rain on Glass, Rain on Leaves, Rain on Tent, Rain on Car Roof, Glass Fruit Slicing, Soap Carving, Glass Clinking, Glass Shatter, Thunderstorm Sleep (1hr), Ocean Waves for Sleep (1hr), Face Scratching & Whispers (30min)
- **Remaining trigger sounds to build**:
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

## Phase 4: Social & Community ⏳ (Planned)
- **Shared mixes** — users can create and share custom sound layers via URL
- **Community playlists** — curated collections by other users
- **"Listen with"** — real-time sync with friends (WebRTC)
- **Sound of the day** — featured procedural sound with description

## Phase 5: Advanced Audio & UI ⚡ (Partially started)
- **Sleep timer UI** — store logic exists in `audio-store.ts` (`setTimer`, `cancelTimer`, `timerRemaining`, auto-fade), needs front-end UI component
- **Remaining Audio v2 features**:
  - Convolution reverb for spatial depth
  - Dynamic compressor for smooth blending
  - Stereo panning per sound layer
  - Parametric EQ per channel
- **Visualizer** — real-time waveform and spectrum display
- **Crossfade presets** — smooth transitions between mixes
- **Ambient mode** — full-screen audio-only with dimmed UI for sleep

## Phase 6: Premium & Monetization ⏳ (Planned)
- **Premium tier**:
  - High-bitrate audio engine mode
  - Exclusive sounds (16 already tagged as premium)
  - Unlimited layers in mixer (free tier cap at 4)
  - Advanced EQ and effects per channel
  - Export mixes as high-quality files
- **One-time purchases** — individual sound pack purchases
- **Subscription** — monthly/annual for full library access

## Phase 7: Platform Expansion ⏳ (Planned)
- **Mobile PWA** — installable with offline playback of cached mixes
- **Native iOS / Android wrapper** — via Capacitor or React Native
- **Desktop app** — Tauri wrapper with system tray and global hotkeys
- **Browser extension** — replace new tab with Noctune ambient page

## Phase 8: AI & Generative Features ⏳ (Planned)
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
- [ ] Remove unused `howler` dependency (project uses Web Audio API directly)

## Metrics & Success Criteria
- **Engagement**: Avg session length > 20 min
- **Retention**: Day-7 return rate > 30%
- **Mixer usage**: > 40% of users create custom mixes
- **Sound library**: > 100 procedural sounds
- **Platform**: Available on web, mobile, desktop
