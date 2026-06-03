export type BlockKind =
  | "air"
  | "grass"
  | "dirt"
  | "stone"
  | "coal"
  | "iron"
  | "gold"
  | "diamond";

export type MonsterKind = "zombie" | "skeleton" | "enderman";

export interface Block {
  kind: BlockKind;
  /** Hidden monster revealed when removed. */
  monster?: MonsterKind;
}

export type Grid = Block[][];

export const ORE_POINTS: Record<BlockKind, number> = {
  air: 0,
  grass: 1,
  dirt: 1,
  stone: 2,
  coal: 10,
  iron: 25,
  gold: 50,
  diamond: 100,
};

export const MONSTER_HP: Record<MonsterKind, number> = {
  zombie: 4,
  skeleton: 5,
  enderman: 7,
};

export const MONSTER_POINTS: Record<MonsterKind, number> = {
  zombie: 30,
  skeleton: 45,
  enderman: 80,
};

export const MAX_LIVES = 10;
export const LIFE_BONUS_EVERY = 500;
