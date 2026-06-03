# Mountain Search

A 2D side-view block-mining puzzle game for kids aged 6–9. Mine blocks from a mountain by solving math problems and visual puzzles. Discover treasure, battle monsters, and clear the mountain to reach the goal!

## Features

- **Age-appropriate challenges** — Choose an age (6–9) and the math difficulty scales automatically, from simple addition to multi-digit multiplication, fractions, and order of operations.
- **Visual puzzles** — Pattern completion, shape matching, analogies, and "odd one out" logic puzzles.
- **Tap-to-attack combat** — Monsters hide inside blocks. Defeat them before they attack 3 times.
- **Progressive difficulty** — Mountains grow larger and deeper with each level.
- **Pannable view** — Scroll or swipe to explore bigger mountains as levels advance.
- **Local save** — Progress, high score, and settings are saved to `localStorage`. No login required.
- **Pixel-art aesthetic** — Blocky, colorful styling with sharp edges and large tap targets.

## Tech Stack

- **Framework:** React 19 + TanStack Start (TanStack Router)
- **Styling:** Tailwind CSS v4 + custom CSS variables
- **Build Tool:** Vite 7
- **Language:** TypeScript (strict mode)
- **Storage:** LocalStorage (no backend required)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (or [Bun](https://bun.sh) 1.0+)
- A package manager: `npm`, `yarn`, `pnpm`, or `bun`

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Install dependencies

Using **Bun** (recommended):
```bash
bun install
```

Using npm:
```bash
npm install
```

### 3. Start the development server

Using Bun:
```bash
bun run dev
```

Using npm:
```bash
npm run dev
```

The game will be available at `http://localhost:3000` (or the next available port shown in your terminal).

## Building for Production

Using Bun:
```bash
bun run build
```

Using npm:
```bash
npm run build
```

The production build is output to `dist/`. To preview it locally:
```bash
bun run preview
# or
npm run preview
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start the Vite development server with HMR |
| `build` | Build the app for production |
| `build:dev` | Build the app in development mode |
| `preview` | Preview the production build locally |
| `lint` | Run ESLint across the codebase |
| `format` | Run Prettier to auto-format all files |

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # React components (game UI, modals, HUD, etc.)
│   ├── game/            # Game logic: mountain generation, challenges, puzzles, types
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility libraries and helpers
│   ├── routes/          # TanStack Router routes
│   ├── styles.css       # Global styles, design tokens, and Tailwind imports
│   ├── router.tsx       # Router configuration
│   └── start.ts         # TanStack Start server entry
├── .lovable/
│   └── plan.md          # Product plan and architecture notes
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Game Mechanics (Quick Reference)

| Element | Details |
|---------|---------|
| **Goal** | Find and clear the **Goal** block (star) hidden in the mountain |
| **Lives** | Start with 10. Lose 1 if a monster defeats you. Gain 1 life every 500 points (max 10) |
| **Ores** | Coal (+10), Iron (+25), Gold (+50), Diamond (+100), Goal (+200) |
| **Monsters** | Spawn from mined blocks. Tap rapidly to reduce their HP before they attack 3 times |
| **Accessibility** | Only exposed blocks (with air on top, left, or right) can be selected |
| **Panning** | Scroll or swipe to move around larger mountains on higher levels |

## Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari & Chrome (iOS / Android)

## License

[MIT](LICENSE) — or replace with your chosen license.
