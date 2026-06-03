import { generateMath } from "./banks/math";
import { generatePuzzle, type PuzzleChallenge } from "./banks/puzzles";
import { ORE_POINTS, type BlockKind } from "./types";

export interface MathChallenge {
  type: "math";
  prompt: string;
  options: number[];
  answer: number;
}

export type { PuzzleChallenge };

export type Challenge = MathChallenge | PuzzleChallenge;

/**
 * Map a block kind to a difficulty tier 0..5, proportional to its point
 * reward. Higher-value resources unlock harder problems.
 *   dirt/grass (1)  → 0   stone (2)   → 1
 *   coal (10)       → 2   iron (25)   → 3
 *   gold (50)       → 4   diamond (100) / goal (200) → 5
 */
export function difficultyForKind(kind: BlockKind): number {
  const pts = ORE_POINTS[kind] ?? 0;
  if (pts <= 1) return 0;
  if (pts <= 2) return 1;
  if (pts <= 10) return 2;
  if (pts <= 25) return 3;
  if (pts <= 50) return 4;
  return 5;
}

export function randomChallenge(
  age: number,
  _level: number,
  kind: BlockKind = "stone",
): Challenge {
  const difficulty = difficultyForKind(kind);
  // ~60% math, 40% puzzle so kids practice arithmetic regularly.
  return Math.random() < 0.6
    ? generateMath(age, difficulty)
    : generatePuzzle(age, difficulty);
}
