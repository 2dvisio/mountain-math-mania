import { generateMath } from "./banks/math";
import { generatePuzzle, type PuzzleChallenge } from "./banks/puzzles";

export interface MathChallenge {
  type: "math";
  prompt: string;
  options: number[];
  answer: number;
}

export type { PuzzleChallenge };

export type Challenge = MathChallenge | PuzzleChallenge;

export function randomChallenge(age: number, _level: number): Challenge {
  // ~60% math, 40% puzzle so kids practice arithmetic regularly.
  return Math.random() < 0.6 ? generateMath(age) : generatePuzzle(age);
}
