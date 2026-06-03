import type { Block, BlockKind, Grid, MonsterKind } from "./types";

const MONSTERS: MonsterKind[] = ["zombie", "skeleton", "enderman"];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generate a side-view mountain. Returns rows top-to-bottom. */
export function generateMountain(level: number): Grid {
  // Grows steadily — bigger levels overflow viewport and require panning.
  const width = Math.min(9 + Math.floor(level * 1.2), 28);
  const height = Math.min(6 + Math.floor(level * 0.8), 16);
  const peakHeight = Math.min(height, 4 + Math.floor(level * 0.7));

  // Heights per column (number of blocks stacked from the bottom).
  const center = (width - 1) / 2;
  const heights: number[] = [];
  for (let c = 0; c < width; c++) {
    const distFromCenter = Math.abs(c - center);
    let h = Math.round(peakHeight - distFromCenter * 0.9);
    // small randomness for jagged silhouette
    h += rand(-1, 1);
    h = Math.max(1, Math.min(height, h));
    heights.push(h);
  }

  // Build empty grid (rows 0 = top of sky)
  const grid: Grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => ({ kind: "air" as BlockKind })),
  );

  // Fill columns from bottom up
  for (let c = 0; c < width; c++) {
    const h = heights[c];
    for (let i = 0; i < h; i++) {
      const row = height - 1 - i; // bottom-up
      const depthFromTop = h - 1 - i; // 0 = top of this column
      let kind: BlockKind;
      if (depthFromTop === 0) kind = "grass";
      else if (depthFromTop <= 1) kind = "dirt";
      else kind = "stone";

      // Ore chances increase with level and depth
      const oreRoll = Math.random();
      const depthBoost = depthFromTop * 0.02;
      const levelBoost = level * 0.01;
      if (kind === "stone" || kind === "dirt") {
        if (oreRoll < 0.04 + depthBoost + levelBoost) kind = "diamond";
        else if (oreRoll < 0.1 + depthBoost + levelBoost) kind = "gold";
        else if (oreRoll < 0.2 + depthBoost + levelBoost) kind = "iron";
        else if (oreRoll < 0.32 + depthBoost + levelBoost) kind = "coal";
      }

      const block: Block = { kind };
      // Monster hidden in solid non-grass blocks. Much higher spawn rate so kids meet monsters quickly.
      const monsterChance = 0.25 + Math.min(0.2, level * 0.02);
      if (kind !== "grass" && Math.random() < monsterChance) {
        block.monster = MONSTERS[rand(0, MONSTERS.length - 1)];
      }
      grid[row][c] = block;
    }
  }

  // Place the GOAL block buried DEEP inside the mountain — near the bottom
  // of the tallest central column so kids must mine through many layers.
  const midCol = Math.floor(width / 2);
  let goalCol = midCol;
  let bestH = heights[midCol];
  // Search within ±25% of the width for the tallest column.
  const searchRadius = Math.max(1, Math.floor(width * 0.25));
  for (let off = 1; off <= searchRadius; off++) {
    if (midCol + off < width && heights[midCol + off] > bestH) {
      bestH = heights[midCol + off];
      goalCol = midCol + off;
    }
    if (midCol - off >= 0 && heights[midCol - off] > bestH) {
      bestH = heights[midCol - off];
      goalCol = midCol - off;
    }
  }
  // Bury 1-2 blocks above the bottom of that column.
  const goalDepthFromBottom = bestH >= 4 ? 1 : 0;
  const goalRow = height - 1 - goalDepthFromBottom;
  grid[goalRow][goalCol] = { kind: "goal" };

  return grid;
}

/** A block is accessible if it's solid and at least one neighbor (4-dir) is air or out-of-bounds-top/side. */
export function isAccessible(grid: Grid, row: number, col: number): boolean {
  const b = grid[row]?.[col];
  if (!b || b.kind === "air") return false;
  const neighbors: Array<[number, number]> = [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];
  for (const [r, c] of neighbors) {
    if (r < 0 || c < 0 || c >= grid[0].length) return true; // exposed to outside
    if (r >= grid.length) continue; // below ground does not count as exposure
    if (grid[r][c].kind === "air") return true;
  }
  return false;
}

export function isCleared(grid: Grid): boolean {
  // Level ends when the goal block is gone (or no blocks remain).
  for (const row of grid) for (const b of row) if (b.kind === "goal") return false;
  return true;
}
