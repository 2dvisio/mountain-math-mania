export type Challenge = MathChallenge | PatternChallenge | ShapeChallenge;

export interface MathChallenge {
  type: "math";
  prompt: string;
  options: number[];
  answer: number;
}

export interface PatternChallenge {
  type: "pattern";
  prompt: string;
  sequence: string[]; // emoji
  options: string[];
  answer: string;
}

export interface ShapeChallenge {
  type: "shape";
  prompt: string;
  target: string;
  options: string[];
  answer: string;
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeMath(level: number): MathChallenge {
  // Level 1-2: addition/subtraction within 10
  // Level 3-4: within 20
  // Level 5+: introduce simple multiplication
  let a: number, b: number, op: "+" | "-" | "×", answer: number;
  if (level <= 2) {
    a = rand(1, 9);
    b = rand(1, 9);
    op = Math.random() < 0.5 ? "+" : "-";
    if (op === "-" && b > a) [a, b] = [b, a];
  } else if (level <= 4) {
    a = rand(2, 18);
    b = rand(1, 9);
    op = Math.random() < 0.5 ? "+" : "-";
    if (op === "-" && b > a) [a, b] = [b, a];
  } else {
    const roll = Math.random();
    if (roll < 0.4) {
      a = rand(1, 5);
      b = rand(1, 5);
      op = "×";
    } else {
      a = rand(5, 25);
      b = rand(1, 12);
      op = Math.random() < 0.5 ? "+" : "-";
      if (op === "-" && b > a) [a, b] = [b, a];
    }
  }
  answer = op === "+" ? a + b : op === "-" ? a - b : a * b;
  const distractors = new Set<number>();
  while (distractors.size < 3) {
    const d = answer + rand(-4, 4);
    if (d !== answer && d >= 0) distractors.add(d);
  }
  return {
    type: "math",
    prompt: `${a} ${op} ${b} = ?`,
    options: shuffle([answer, ...distractors]),
    answer,
  };
}

const PATTERN_POOLS = [
  ["🟥", "🟦", "🟥", "🟦", "🟥"],
  ["⭐", "🌙", "⭐", "🌙", "⭐"],
  ["🍎", "🍌", "🍎", "🍌", "🍎"],
  ["🟢", "🟡", "🔴", "🟢", "🟡"],
  ["🐶", "🐱", "🐶", "🐱", "🐶"],
];

function makePattern(): PatternChallenge {
  const pool = PATTERN_POOLS[rand(0, PATTERN_POOLS.length - 1)];
  const seqLen = 4;
  const seq = pool.slice(0, seqLen);
  const answer = pool[seqLen]; // next item
  const distractors = shuffle(pool.filter((p) => p !== answer)).slice(0, 3);
  return {
    type: "pattern",
    prompt: "What comes next?",
    sequence: seq,
    options: shuffle([answer, ...distractors]),
    answer,
  };
}

const SHAPES = ["▲", "■", "●", "◆", "★", "♥"];

function makeShape(): ShapeChallenge {
  const target = SHAPES[rand(0, SHAPES.length - 1)];
  const distractors = shuffle(SHAPES.filter((s) => s !== target)).slice(0, 3);
  return {
    type: "shape",
    prompt: "Which one matches?",
    target,
    options: shuffle([target, ...distractors]),
    answer: target,
  };
}

export function randomChallenge(level: number): Challenge {
  const roll = Math.random();
  if (roll < 0.6) return makeMath(level);
  if (roll < 0.8) return makePattern();
  return makeShape();
}
