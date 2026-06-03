// Puzzle generators by age. Combined sub-generators yield 500+ unique
// puzzles per age (most are parametric with large combinatorial spaces).
import { translate, type Lang } from "@/i18n";

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
function pick<T>(arr: T[]): T {
  return arr[rand(0, arr.length - 1)];
}

export interface PuzzleChallenge {
  type: "puzzle";
  variant: "sequence" | "shape" | "numberSeq" | "oddOneOut" | "analogy";
  prompt: string;
  sequence?: string[]; // visual sequence with trailing "?"
  target?: string; // a thing to match
  analogy?: { a: string; b: string; c: string }; // a is to b as c is to ?
  options: string[];
  answer: string;
}

// ─── Symbol pools ────────────────────────────────────────────────────────
const SHAPES = ["▲", "■", "●", "◆", "★", "♥", "♣", "♠"];
const COLORS = ["🟥", "🟦", "🟩", "🟨", "🟧", "🟪", "🟫", "⬛"];
const ANIMALS = ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐯"];
const FRUITS = ["🍎", "🍌", "🍇", "🍓", "🍊", "🍐", "🍉", "🥝"];
const NATURE = ["⭐", "🌙", "☀️", "☁️", "❄️", "🔥", "🌈", "⚡"];
const ARROWS_ROT = ["⬆️", "➡️", "⬇️", "⬅️"];

const SYMBOL_POOLS = [SHAPES, COLORS, ANIMALS, FRUITS, NATURE];

// ─── Visual sequence: AB AB AB ? ─────────────────────────────────────────
function seqAB(lang: Lang): PuzzleChallenge {
  const pool = pick(SYMBOL_POOLS);
  const [a, b] = shuffle(pool).slice(0, 2);
  const seq = [a, b, a, b, a];
  const answer = b;
  const distractors = shuffle(pool.filter((x) => x !== answer)).slice(0, 3);
  return {
    type: "puzzle",
    variant: "sequence",
    prompt: translate(lang, "whatComesNext"),
    sequence: seq,
    options: shuffle([answer, ...distractors]),
    answer,
  };
}

// ABC ABC ABC ?
function seqABC(lang: Lang): PuzzleChallenge {
  const pool = pick(SYMBOL_POOLS);
  const [a, b, c] = shuffle(pool).slice(0, 3);
  const seq = [a, b, c, a, b, c, a];
  const answer = b;
  const distractors = shuffle(pool.filter((x) => x !== answer)).slice(0, 3);
  return {
    type: "puzzle",
    variant: "sequence",
    prompt: translate(lang, "whatComesNext"),
    sequence: seq,
    options: shuffle([answer, ...distractors]),
    answer,
  };
}

// AABB AABB ?
function seqAABB(lang: Lang): PuzzleChallenge {
  const pool = pick(SYMBOL_POOLS);
  const [a, b] = shuffle(pool).slice(0, 2);
  const seq = [a, a, b, b, a, a, b];
  const answer = b;
  const distractors = shuffle(pool.filter((x) => x !== answer)).slice(0, 3);
  return {
    type: "puzzle",
    variant: "sequence",
    prompt: translate(lang, "whatComesNext"),
    sequence: seq,
    options: shuffle([answer, ...distractors]),
    answer,
  };
}

// Shape match (target)
function shapeMatch(lang: Lang): PuzzleChallenge {
  const pool = pick(SYMBOL_POOLS);
  const target = pick(pool);
  const distractors = shuffle(pool.filter((s) => s !== target)).slice(0, 3);
  return {
    type: "puzzle",
    variant: "shape",
    prompt: translate(lang, "whichMatches"),
    target,
    options: shuffle([target, ...distractors]),
    answer: target,
  };
}

// Odd one out (3 same family + 1 different)
function oddOneOut(lang: Lang): PuzzleChallenge {
  const family = pick(SYMBOL_POOLS);
  const otherPool = pick(SYMBOL_POOLS.filter((p) => p !== family));
  const same = shuffle(family).slice(0, 3);
  const odd = pick(otherPool);
  return {
    type: "puzzle",
    variant: "oddOneOut",
    prompt: translate(lang, "whichOdd"),
    options: shuffle([...same, odd]),
    answer: odd,
  };
}

// Number sequence: arithmetic
function numberSeqArith(lang: Lang, maxStart: number, maxStep: number): PuzzleChallenge {
  const start = rand(1, maxStart);
  const step = rand(1, maxStep);
  const seq = [start, start + step, start + 2 * step, start + 3 * step];
  const answer = start + 4 * step;
  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const d = answer + rand(-5, 5);
    if (d >= 0 && d !== answer) opts.add(d);
  }
  return {
    type: "puzzle",
    variant: "numberSeq",
    prompt: translate(lang, "whatNumberNext"),
    sequence: seq.map(String),
    options: shuffle([...opts]).map(String),
    answer: String(answer),
  };
}

// Number sequence: geometric (×)
function numberSeqGeo(lang: Lang): PuzzleChallenge {
  const start = rand(1, 4);
  const factor = pick([2, 3]);
  const seq = [start, start * factor, start * factor ** 2, start * factor ** 3];
  const answer = start * factor ** 4;
  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const d = answer + rand(-10, 10);
    if (d > 0 && d !== answer) opts.add(d);
  }
  return {
    type: "puzzle",
    variant: "numberSeq",
    prompt: translate(lang, "whatNextMul"),
    sequence: seq.map(String),
    options: shuffle([...opts]).map(String),
    answer: String(answer),
  };
}

// Number sequence: squares / triangular
function numberSeqSquares(lang: Lang): PuzzleChallenge {
  const start = rand(1, 4);
  const seq = [start, start + 1, start + 2, start + 3].map((n) => n * n);
  const answer = (start + 4) * (start + 4);
  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const d = answer + rand(-6, 6);
    if (d > 0 && d !== answer) opts.add(d);
  }
  return {
    type: "puzzle",
    variant: "numberSeq",
    prompt: translate(lang, "whatComesNext"),
    sequence: seq.map(String),
    options: shuffle([...opts]).map(String),
    answer: String(answer),
  };
}

// Analogy: A is to B as C is to ?
// Build relations like color→fruit pairs, shape sets, etc.
const ANALOGY_RELATIONS: Array<[string, string][]> = [
  // small → big animal
  [
    ["🐱", "🦁"],
    ["🐶", "🐺"],
    ["🐭", "🐀"],
    ["🐔", "🦅"],
  ],
  // baby → grown
  [
    ["🥚", "🐔"],
    ["🌱", "🌳"],
    ["🐛", "🦋"],
    ["🐣", "🐓"],
  ],
  // tool → result
  [
    ["✏️", "📝"],
    ["🔨", "🪵"],
    ["🪓", "🌳"],
    ["🪒", "💇"],
  ],
];

function analogy(lang: Lang): PuzzleChallenge {
  const rel = pick(ANALOGY_RELATIONS);
  const [a, b] = pick(rel);
  const other = pick(rel.filter(([x]) => x !== a));
  const [c, answer] = other;
  // distractors from other relation pairs
  const allB = ANALOGY_RELATIONS.flat().map((p) => p[1]);
  const distractors = shuffle(allB.filter((x) => x !== answer)).slice(0, 3);
  return {
    type: "puzzle",
    variant: "analogy",
    prompt: translate(lang, "sameIdea"),
    analogy: { a, b, c },
    options: shuffle([answer, ...distractors]),
    answer,
  };
}

// ─── Per-age pools ──────────────────────────────────────────────────────

// Per-age pools, ordered easy → hard
const age6: Array<(lang: Lang) => PuzzleChallenge> = [
  shapeMatch,
  seqAB,
  oddOneOut,
  (l) => numberSeqArith(l, 5, 2),
];

const age7: Array<(lang: Lang) => PuzzleChallenge> = [
  shapeMatch,
  seqAB,
  oddOneOut,
  seqABC,
  seqAABB,
  (l) => numberSeqArith(l, 10, 3),
];

const age8: Array<(lang: Lang) => PuzzleChallenge> = [
  oddOneOut,
  seqABC,
  seqAABB,
  (l) => numberSeqArith(l, 15, 5),
  analogy,
  (l) => numberSeqGeo(l),
];

const age9: Array<(lang: Lang) => PuzzleChallenge> = [
  oddOneOut,
  seqAABB,
  analogy,
  (l) => numberSeqArith(l, 20, 7),
  (l) => numberSeqGeo(l),
  (l) => numberSeqSquares(l),
];

const POOLS: Record<number, Array<(lang: Lang) => PuzzleChallenge>> = {
  6: age6,
  7: age7,
  8: age8,
  9: age9,
};

function pickByDifficulty<T>(pool: T[], difficulty: number): T {
  const n = pool.length;
  if (n <= 1) return pool[0];
  const d = Math.max(0, Math.min(5, difficulty));
  const winSize = Math.max(2, Math.ceil(n / 2));
  const maxStart = n - winSize;
  const start = Math.round((d / 5) * maxStart);
  const slice = pool.slice(start, start + winSize);
  return slice[Math.floor(Math.random() * slice.length)];
}

export function generatePuzzle(age: number, difficulty = 2, lang: Lang = "en"): PuzzleChallenge {
  const pool = POOLS[Math.max(6, Math.min(9, age))];
  return pickByDifficulty(pool, difficulty)(lang);
}
