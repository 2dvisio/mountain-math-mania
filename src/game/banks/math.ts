// Math problem generators by age. Each age has multiple sub-generators
// that together produce well over 500 unique problems.

import type { MathChallenge } from "../challenges";

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

function build(prompt: string, answer: number, spread: number): MathChallenge {
  const opts = new Set<number>([answer]);
  while (opts.size < 4) {
    const d = answer + rand(-spread, spread);
    if (d >= 0 && d !== answer) opts.add(d);
  }
  return { type: "math", prompt, options: shuffle([...opts]), answer };
}

// ─── AGE 6 ─── ordered easy → hard
const age6Gens: Array<() => MathChallenge> = [
  // doubles (easy)
  () => {
    const a = rand(1, 5);
    return build(`${a} + ${a} = ?`, a * 2, 2);
  },
  // add within 10
  () => {
    const a = rand(1, 9), b = rand(1, 10 - a);
    return build(`${a} + ${b} = ?`, a + b, 3);
  },
  // compare
  () => {
    const a = rand(1, 9), b = rand(1, 9);
    return build(`Which is bigger: ${a} or ${b}?`, Math.max(a, b), 2);
  },
  // sub within 10
  () => {
    const a = rand(2, 10), b = rand(1, a);
    return build(`${a} − ${b} = ?`, a - b, 3);
  },
  // skip count
  () => {
    const step = pick([2, 5, 10]);
    const start = step * rand(1, 5);
    return build(`${start}, ${start + step}, ${start + 2 * step}, ?`, start + 3 * step, step + 1);
  },
  // missing addend
  () => {
    const total = rand(5, 15), a = rand(1, total - 1);
    return build(`${a} + ? = ${total}`, total - a, 3);
  },
  // add within 20
  () => {
    const a = rand(2, 18), b = rand(1, 20 - a);
    return build(`${a} + ${b} = ?`, a + b, 4);
  },
  // sub within 20 (hardest)
  () => {
    const a = rand(5, 20), b = rand(1, a);
    return build(`${a} − ${b} = ?`, a - b, 4);
  },
];

// ─── AGE 7 ─── ordered easy → hard
const age7Gens: Array<() => MathChallenge> = [
  // half of even (easy)
  () => {
    const a = rand(2, 10) * 2;
    return build(`Half of ${a} = ?`, a / 2, 3);
  },
  // mult 10x
  () => {
    const a = rand(1, 12);
    return build(`10 × ${a} = ?`, 10 * a, 8);
  },
  // mult 2x
  () => {
    const a = rand(1, 12);
    return build(`2 × ${a} = ?`, 2 * a, 3);
  },
  // mult 5x
  () => {
    const a = rand(1, 12);
    return build(`5 × ${a} = ?`, 5 * a, 5);
  },
  // missing addend within 20
  () => {
    const total = rand(10, 20), a = rand(1, total - 1);
    return build(`${a} + ? = ${total}`, total - a, 4);
  },
  // add within 100 no carry
  () => {
    const t1 = rand(1, 8), o1 = rand(0, 9);
    const t2 = rand(1, 9 - t1), o2 = rand(0, 9 - o1);
    const a = t1 * 10 + o1, b = t2 * 10 + o2;
    return build(`${a} + ${b} = ?`, a + b, 6);
  },
  // doubles within 50
  () => {
    const a = rand(11, 25);
    return build(`${a} + ${a} = ?`, a * 2, 5);
  },
  // missing subtrahend
  () => {
    const a = rand(10, 20), result = rand(1, a - 1);
    return build(`${a} − ? = ${result}`, a - result, 4);
  },
  // sub within 100
  () => {
    const a = rand(20, 99), b = rand(1, a);
    return build(`${a} − ${b} = ?`, a - b, 6);
  },
  // add within 100 with carry (hardest)
  () => {
    const a = rand(15, 60), b = rand(15, 40);
    return build(`${a} + ${b} = ?`, a + b, 6);
  },
];

// ─── AGE 8 ─── ordered easy → hard
const age8Gens: Array<() => MathChallenge> = [
  // mult tables 2-10
  () => {
    const a = rand(2, 10), b = rand(2, 10);
    return build(`${a} × ${b} = ?`, a * b, 8);
  },
  // division facts
  () => {
    const b = rand(2, 10), q = rand(2, 10);
    return build(`${b * q} ÷ ${b} = ?`, q, 4);
  },
  // missing factor
  () => {
    const a = rand(2, 10), b = rand(2, 10);
    return build(`${a} × ? = ${a * b}`, b, 3);
  },
  // mult by 11
  () => {
    const a = rand(2, 9);
    return build(`11 × ${a} = ?`, 11 * a, 6);
  },
  // squares
  () => {
    const a = rand(2, 12);
    return build(`${a} × ${a} = ?`, a * a, 6);
  },
  // fraction of
  () => {
    const denom = pick([2, 3, 4, 5]);
    const mult = rand(2, 8);
    const total = denom * mult;
    return build(`1/${denom} of ${total} = ?`, mult, 3);
  },
  // missing dividend
  () => {
    const b = rand(2, 9), q = rand(2, 9);
    return build(`? ÷ ${b} = ${q}`, b * q, 5);
  },
  // 2-digit add with carry
  () => {
    const a = rand(15, 89), b = rand(15, 89);
    return build(`${a} + ${b} = ?`, a + b, 8);
  },
  // 2-digit sub with borrow
  () => {
    const a = rand(40, 99), b = rand(15, a - 5);
    return build(`${a} − ${b} = ?`, a - b, 8);
  },
  // two-step add/sub (hardest)
  () => {
    const a = rand(10, 40), b = rand(5, 30), c = rand(5, 20);
    return build(`${a} + ${b} − ${c} = ?`, a + b - c, 6);
  },
];

// ─── AGE 9 ─── ordered easy → hard
const age9Gens: Array<() => MathChallenge> = [
  // 3-digit add (easy bigger numbers)
  () => {
    const a = rand(100, 800), b = rand(100, 800);
    return build(`${a} + ${b} = ?`, a + b, 15);
  },
  // percent of 100
  () => {
    const p = pick([10, 20, 25, 50, 75]);
    const n = pick([100, 200, 400, 60, 80, 40]);
    return build(`${p}% of ${n} = ?`, (p * n) / 100, 8);
  },
  // fraction add same denom
  () => {
    const d = pick([4, 5, 6, 8, 10]);
    const a = rand(1, d - 2), b = rand(1, d - a);
    return build(`${a}/${d} + ${b}/${d} = ?/${d}`, a + b, 2);
  },
  // 2-digit × 1-digit
  () => {
    const a = rand(11, 50), b = rand(2, 9);
    return build(`${a} × ${b} = ?`, a * b, 10);
  },
  // decimal add (tenths)
  () => {
    const a = rand(1, 90), b = rand(1, 90);
    const ans = (a + b) / 10;
    const opts = new Set<number>([ans]);
    while (opts.size < 4) {
      const d = +(ans + rand(-15, 15) / 10).toFixed(1);
      if (d >= 0 && d !== ans) opts.add(d);
    }
    return {
      type: "math",
      prompt: `${(a / 10).toFixed(1)} + ${(b / 10).toFixed(1)} = ?`,
      options: shuffle([...opts]) as number[],
      answer: ans,
    };
  },
  // 3-digit sub
  () => {
    const a = rand(300, 999), b = rand(50, a - 50);
    return build(`${a} − ${b} = ?`, a - b, 15);
  },
  // mixed without parens
  () => {
    const a = rand(2, 9), b = rand(2, 9), c = rand(5, 30);
    return build(`${a} × ${b} + ${c} = ?`, a * b + c, 6);
  },
  // average of 3
  () => {
    const x = rand(2, 20), y = rand(2, 20), z = rand(2, 20);
    const sum = x + y + z;
    if (sum % 3 !== 0) {
      const extra = (3 - (sum % 3)) % 3;
      return build(`Average of ${x}, ${y}, ${z + extra} = ?`, (sum + extra) / 3, 4);
    }
    return build(`Average of ${x}, ${y}, ${z} = ?`, sum / 3, 4);
  },
  // multi-step: a × b − c
  () => {
    const a = rand(4, 12), b = rand(4, 12), c = rand(5, 30);
    return build(`${a} × ${b} − ${c} = ?`, a * b - c, 10);
  },
  // order of ops with parens
  () => {
    const a = rand(2, 9), b = rand(2, 9), c = rand(2, 9);
    const op = pick(["+", "−"]);
    const inner = op === "+" ? a + b : a - b;
    const ans = inner * c;
    return build(`(${a} ${op} ${b}) × ${c} = ?`, ans, 8);
  },
  // division with remainder (hardest)
  () => {
    const divisor = rand(3, 9), q = rand(3, 12), r = rand(1, divisor - 1);
    const dividend = divisor * q + r;
    return build(`${dividend} ÷ ${divisor} = ? (whole part)`, q, 3);
  },
];

const POOLS: Record<number, Array<() => MathChallenge>> = {
  6: age6Gens,
  7: age7Gens,
  8: age8Gens,
  9: age9Gens,
};

/**
 * Pick a generator from a pool ordered easy → hard, biased by difficulty
 * tier (0..5). Tier 0 selects from the easiest half; tier 5 from the
 * hardest half; tiers in between slide a window across the pool.
 */
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

export function generateMath(age: number, difficulty = 2): MathChallenge {
  const pool = POOLS[Math.max(6, Math.min(9, age))];
  return pickByDifficulty(pool, difficulty)();
}
