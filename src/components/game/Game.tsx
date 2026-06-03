import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Mountain } from "@/components/game/Mountain";
import { HUD } from "@/components/game/HUD";
import { ChallengeModal } from "@/components/game/ChallengeModal";
import { CombatModal } from "@/components/game/CombatModal";
import { AgeSelect } from "@/components/game/AgeSelect";
import {
  type Grid,
  type MonsterKind,
  ORE_POINTS,
  MAX_LIVES,
  LIFE_BONUS_EVERY,
} from "@/game/types";
import { generateMountain, isAccessible, isCleared } from "@/game/mountain";
import { randomChallenge, type Challenge } from "@/game/challenges";

type Screen =
  | "title"
  | "ageSelect"
  | "playing"
  | "challenge"
  | "combat"
  | "levelComplete"
  | "gameOver";

const STORAGE_KEY = "mc-mountain-save-v1";

interface SaveData {
  highScore: number;
  age?: number;
}

function loadSave(): SaveData {
  if (typeof window === "undefined") return { highScore: 0 };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { highScore: 0 };
    return JSON.parse(raw) as SaveData;
  } catch {
    return { highScore: 0 };
  }
}

function saveSave(data: SaveData) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function Game() {
  const [screen, setScreen] = useState<Screen>("title");
  const [age, setAge] = useState<number>(7);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [grid, setGrid] = useState<Grid>(() => generateMountain(1));

  const [pending, setPending] = useState<{ row: number; col: number } | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [combat, setCombat] = useState<MonsterKind | null>(null);

  const nextLifeAt = useRef(LIFE_BONUS_EVERY);

  useEffect(() => {
    const s = loadSave();
    setHighScore(s.highScore);
    if (s.age) setAge(s.age);
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      const existing = loadSave();
      saveSave({ ...existing, highScore: score });
    }
  }, [score, highScore]);

  const startGame = useCallback(() => {
    setLevel(1);
    setLives(MAX_LIVES);
    setScore(0);
    setGrid(generateMountain(1));
    nextLifeAt.current = LIFE_BONUS_EVERY;
    setScreen("ageSelect");
  }, []);

  const handleAgePick = useCallback((picked: number) => {
    setAge(picked);
    const existing = loadSave();
    saveSave({ ...existing, age: picked });
    setScreen("playing");
  }, []);

  const startNextLevel = useCallback(() => {
    const next = level + 1;
    setLevel(next);
    setGrid(generateMountain(next));
    setScreen("playing");
  }, [level]);

  const handleMine = useCallback(
    (row: number, col: number) => {
      if (!isAccessible(grid, row, col)) return;
      setPending({ row, col });
      setChallenge(randomChallenge(age, level));
      setScreen("challenge");
    },
    [grid, level, age],
  );

  const removeBlockAndReward = useCallback(
    (row: number, col: number, bonus = 0) => {
      const block = grid[row][col];
      const kindPoints = ORE_POINTS[block.kind];
      const totalPoints = kindPoints + bonus;

      const newGrid = grid.map((r) => r.slice());
      newGrid[row][col] = { kind: "air" };
      setGrid(newGrid);

      if (bonus > 0) {
        toast.success(`+${totalPoints} points!`);
      } else if (kindPoints > 0) {
        const labels: Record<string, string> = {
          coal: "Coal +10",
          iron: "Iron +25",
          gold: "Gold +50",
          diamond: "Diamond +100",
          goal: "🏁 Goal reached! +200",
          grass: "+1",
          dirt: "+1",
          stone: "+2",
        };
        toast.success(labels[block.kind] ?? `+${kindPoints}`);
      }

      setScore((s) => {
        const next = s + totalPoints;
        while (next >= nextLifeAt.current) {
          setLives((l) => {
            if (l < MAX_LIVES) {
              toast.success("❤️ Extra life!");
              return l + 1;
            }
            return l;
          });
          nextLifeAt.current += LIFE_BONUS_EVERY;
        }
        return next;
      });

      if (isCleared(newGrid)) {
        window.setTimeout(() => setScreen("levelComplete"), 250);
      } else {
        setScreen("playing");
      }
    },
    [grid],
  );

  const handleChallengeResult = useCallback(
    (correct: boolean) => {
      if (!pending) return;
      const { row, col } = pending;
      setChallenge(null);

      if (!correct) {
        toast.error("Not quite! Try a different block.");
        setPending(null);
        setScreen("playing");
        return;
      }

      const block = grid[row][col];
      if (block.monster) {
        setCombat(block.monster);
        setScreen("combat");
      } else {
        setPending(null);
        removeBlockAndReward(row, col);
      }
    },
    [pending, grid, removeBlockAndReward],
  );

  const handleCombatEnd = useCallback(
    ({ won, points }: { won: boolean; points: number }) => {
      setCombat(null);
      const target = pending;
      setPending(null);

      if (won && target) {
        toast.success(`Monster defeated! +${points}`);
        removeBlockAndReward(target.row, target.col, points);
      } else {
        setLives((l) => {
          const next = l - 1;
          if (next <= 0) {
            window.setTimeout(() => setScreen("gameOver"), 200);
          } else {
            toast.error("Ouch! You lost a life.");
            setScreen("playing");
          }
          return Math.max(0, next);
        });
      }
    },
    [pending, removeBlockAndReward],
  );

  const blocksLeft = useMemo(
    () => grid.reduce((acc, row) => acc + row.filter((b) => b.kind !== "air").length, 0),
    [grid],
  );

  return (
    <div className="min-h-screen sky-bg">
      <div className="mx-auto max-w-3xl px-4 py-4">
        {screen !== "title" && screen !== "gameOver" && screen !== "ageSelect" && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-foreground drop-shadow-sm">
                ⛏️ Minecraft Mountain
              </h1>
              <button
                onClick={() => setScreen("ageSelect")}
                className="btn-pixel rounded-md bg-secondary px-3 py-1 text-xs font-bold"
                aria-label="Change age"
              >
                Age: {age}
              </button>
            </div>
            <HUD score={score} lives={lives} level={level} highScore={highScore} />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Blocks left: <strong>{blocksLeft}</strong> · Tap a block on the edge to mine it!
            </p>
            <div className="mt-4">
              <Mountain grid={grid} onMine={handleMine} />
            </div>
          </>
        )}

        {screen === "title" && <TitleScreen highScore={highScore} onStart={startGame} />}

        {screen === "ageSelect" && <AgeSelect onPick={handleAgePick} />}

        {screen === "challenge" && challenge && (
          <ChallengeModal challenge={challenge} onResult={handleChallengeResult} />
        )}

        {screen === "combat" && combat && (
          <CombatModal monster={combat} onEnd={handleCombatEnd} />
        )}

        {screen === "levelComplete" && (
          <Overlay
            title="🏆 Mountain Cleared!"
            subtitle={`You finished level ${level}!`}
            stats={[
              { label: "Score", value: score },
              { label: "Lives", value: `${lives} / ${MAX_LIVES}` },
            ]}
            actionLabel="Next Level →"
            onAction={startNextLevel}
          />
        )}

        {screen === "gameOver" && (
          <Overlay
            title="💥 Game Over"
            subtitle="You ran out of lives."
            stats={[
              { label: "Final Score", value: score },
              { label: "Best", value: highScore },
              { label: "Level", value: level },
            ]}
            actionLabel="Play Again"
            onAction={startGame}
          />
        )}
      </div>
    </div>
  );
}

function TitleScreen({ highScore, onStart }: { highScore: number; onStart: () => void }) {
  return (
    <div className="grid min-h-[80vh] place-items-center">
      <div className="w-full max-w-lg rounded-2xl border-4 border-primary bg-card p-8 text-center shadow-2xl animate-pop">
        <div className="mb-4 text-6xl">⛏️ ⛰️</div>
        <h1 className="text-4xl font-extrabold tracking-tight">Minecraft Mountain</h1>
        <p className="mt-2 text-muted-foreground">
          Mine the mountain block by block. Solve math and puzzles, grab diamonds, and beat monsters!
        </p>
        <div className="my-6 rounded-lg bg-muted p-4 text-left text-sm">
          <p className="mb-1 font-bold">How to play:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Tap any block on the <strong>edge</strong> of the mountain.</li>
            <li>Solve a math problem or puzzle to mine it.</li>
            <li>Watch out for monsters — tap fast to defeat them!</li>
            <li>Every 500 points gives you an extra ❤️.</li>
            <li>Bigger mountains scroll — swipe or scroll to see them all.</li>
          </ul>
        </div>
        {highScore > 0 && (
          <p className="mb-4 text-sm text-muted-foreground">
            Your best score: <strong className="text-foreground">{highScore}</strong>
          </p>
        )}
        <button
          onClick={onStart}
          className="btn-pixel rounded-xl bg-primary px-8 py-4 text-2xl font-extrabold text-primary-foreground"
        >
          ▶ Start Game
        </button>
      </div>
    </div>
  );
}

function Overlay({
  title,
  subtitle,
  stats,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  stats: { label: string; value: number | string }[];
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border-4 border-accent bg-card p-6 text-center shadow-2xl animate-pop">
        <h2 className="text-3xl font-extrabold">{title}</h2>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
        <div className="my-5 grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-lg bg-muted p-3">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <div className="text-xl font-extrabold tabular-nums">{s.value}</div>
            </div>
          ))}
        </div>
        <button
          onClick={onAction}
          className="btn-pixel rounded-xl bg-primary px-6 py-3 text-xl font-extrabold text-primary-foreground"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
