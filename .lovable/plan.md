# Plan: Mountain Search Game

## Product Overview
A 2D side-view pixel-art game where kids mine a block mountain. To remove a block they must solve a math problem or visual puzzle. Blocks can hide treasure (points) or monsters (tap-to-attack combat). 10 lives, score milestones restore lives. Clearing the mountain finishes the level.

## Tech Stack
- React 19 + TanStack Router (single-page game, no routes needed beyond `/`)
- Tailwind CSS + custom CSS for pixel-art styling
- LocalStorage for score, lives, level, and high-score persistence
- No backend required

## Game Architecture

### State Model (single React state tree)
```
GameState {
  screen: 'title' | 'playing' | 'challenge' | 'combat' | 'levelComplete' | 'gameOver'
  level: number
  lives: number (max 10)
  score: number
  mountain: Block[][]   // 2D grid, side-view, bottom-up rows
  selectedBlock: {row, col} | null
  challenge: MathChallenge | PuzzleChallenge | null
  combat: CombatState | null
  settings: { sfxOn: boolean, musicOn: boolean }
}
```

### Block Types (per cell)
- Air / Empty
- Grass (surface top layer)
- Dirt
- Stone
- Coal (points +10)
- Iron (points +25)
- Gold (points +50)
- Diamond (points +100, +1 life at milestones)
- Monster spawn chance: Zombie, Skeleton, Enderman

### Mountain Generation
- Procedurally generate a side-view mountain grid per level.
- Higher levels = wider/taller mountains, deeper ore veins, slightly harder math.
- A block is "accessible" if it's exposed (top/left/right has air, not fully surrounded).

### Challenge System (unlocks block removal)
- **Math**: Age-appropriate problems (addition/subtraction ages 6-7, introduce simple multiplication ages 8-9). Difficulty scales with level.
- **Visual Puzzles**:
  - Pattern completion (what comes next?)
  - Shape matching (which shape is the same?)
  - Memory (briefly show colored blocks, then hide)
- Randomly pick math or puzzle each time a block is clicked.

### Combat System (tap-to-attack)
- Monster appears with HP bar.
- Player taps/click monster repeatedly.
- Each tap reduces monster HP by 1.
- Monster auto-attacks on a timer (every 2-3 seconds).
- If monster HP reaches 0: player wins, +points, monster defeated.
- If monster attacks 3 times without being defeated: player loses 1 life.

### Scoring & Lives
- Treasure points: Coal +10, Iron +25, Gold +50, Diamond +100
- Defeating monster: +30 points
- Every 500 points: +1 life (up to max 10)
- Lives start at 10, lose 1 on combat defeat. Game over at 0 lives.

### Screens / UI
1. **Title Screen** — Game name, "Start Game", "How to Play", pixel-art mountain background.
2. **Playing Screen** — Mountain grid on left/center, HUD (score, lives, level) on top. Instruction overlay for first play.
3. **Challenge Modal** — Math problem or puzzle overlay. Timer optional (no pressure for young kids).
4. **Combat Modal** — Monster sprite, HP bar, tap area, attack timer indicator.
5. **Level Complete** — "Mountain Cleared!" with stats, "Next Level" button.
6. **Game Over** — Final score, high score, "Try Again".

### LocalStorage Save Schema
```json
{
  "highScore": 0,
  "lastLevel": 1,
  "settings": { "sfxOn": true, "musicOn": true }
}
```

### Styling Direction
- Pixel-art aesthetic via CSS: sharp edges, blocky sprites rendered as styled divs or inline SVG.
- Blocky mountain palette: greens, browns, greys, blues — but semantic tokens in styles.css.
- Kid-friendly UI: large tap targets, clear readable fonts, encouraging copy.
- No animations that could trigger motion sensitivity — simple pop-in/out for blocks.

## Milestones
1. Core mountain grid, block rendering, and generation algorithm
2. Click-to-select + accessibility rules (which blocks can be mined)
3. Math challenge engine + visual puzzle engine
4. Monster combat with tap-to-attack
5. Scoring, lives, level progression, and win/lose conditions
6. Title screen, HUD, level complete, game over UI
7. Sound effects (optional) and localStorage persistence
8. Polish, testing on tablet/mobile viewport

## Open Questions
- Should we generate pixel-art block textures as inline SVGs or use CSS gradients/colors for a simpler flat look?
- Do you want a "How to Play" tutorial overlay on first launch?
- Should there be a settings screen to toggle sound and reset progress?