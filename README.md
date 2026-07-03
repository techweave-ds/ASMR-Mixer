# Noctune

> A premium desktop-first ASMR/ambient sound application. Procedural audio generation via Web Audio API, immersive 3D environments via Three.js, and a Spotify-grade desktop layout.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & Deploy

```bash
npm run build    # Static export → out/
npm run deploy   # Publish to Cloudflare Pages
```

## Documentation

See the `docs/` directory for comprehensive project documentation:

| Document | What It Covers |
|----------|----------------|
| [01-OVERVIEW.md](docs/01-OVERVIEW.md) | Product overview, features, status |
| [02-TECHNOLOGY.md](docs/02-TECHNOLOGY.md) | Tech stack, tools, rationale |
| [03-ARCHITECTURE.md](docs/03-ARCHITECTURE.md) | Component/store/engine interaction, data flow |
| [04-STRUCTURE.md](docs/04-STRUCTURE.md) | Full file tree with file purposes |
| [05-REQUIREMENTS.md](docs/05-REQUIREMENTS.md) | Product requirements, design constraints, conventions |

## Stack

- **Framework**: Next.js 16 (static export)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4 with custom design tokens
- **State**: zustand (7 stores)
- **Animation**: framer-motion
- **3D**: Three.js / @react-three/fiber / @react-three/drei
- **Audio**: Web Audio API (procedural generation, zero audio files)
- **Deploy**: Cloudflare Pages
