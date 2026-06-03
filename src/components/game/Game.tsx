import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Mountain } from "@/components/game/Mountain";
import { HUD } from "@/components/game/HUD";
import { ChallengeModal } from "@/components/game/ChallengeModal";
import { CombatModal } from "@/components/game/CombatModal";
import { AgeSelect } from "@/components/game/AgeSelect";
import { LanguageSelect } from "@/components/game/LanguageSelect";
import {
  type Grid,
  type MonsterKind,
  ORE_POINTS,
  MAX_LIVES,
  LIFE_BONUS_EVERY,
} from "@/game/types";
import { generateMountain, isAccessible, isCleared } from "@/game/mountain";
import { randomChallenge, type Challenge } from "@/game/challenges";
import { useI18n, type Lang } from "@/i18n";

type Screen =
  | "title"
  | "languageSelect"
  | "ageSelect"
  | "playing"
  | "challenge"
  | "combat"
  | "levelComplete"
  | "gameOver";

const STORAGE_KEY = "mountain-search-save-v1";

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
  const { t, lang, setLang } = useI18n();
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
    setScreen("languageSelect");
  }, []);

  const handleLanguagePick = useCallback((picked: Lang) => {
    setLang(picked);
    setScreen("ageSelect");
  }, [setLang]);

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
      const kind = grid[row][col].kind;
      setPending({ row, col });
      setChallenge(randomChallenge(age, level, kind, lang));
      setScreen("challenge");
    },
    [grid, level, age, lang],
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
        toast.success(t("pointsPlus", { p: totalPoints }));
      } else if (kindPoints > 0) {
        const labels: Record<string, string> = {
          coal: t("oreCoal"),
          iron: t("oreIron"),
          gold: t("oreGold"),
          diamond: t("oreDiamond"),
          goal: t("oreGoal"),
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
              toast.success(t("extraLife"));
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
    [grid, t],
  );

  const handleChallengeResult = useCallback(
    (correct: boolean) => {
      if (!pending) return;
      const { row, col } = pending;
      setChallenge(null);

      if (!correct) {
        toast.error(t("notQuite"));
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
    [pending, grid, removeBlockAndReward, t],
  );

  const handleCombatEnd = useCallback(
    ({ won, points }: { won: boolean; points: number }) => {
      setCombat(null);
      const target = pending;
      setPending(null);

      if (won && target) {
        toast.success(t("monsterDefeated", { p: points }));
        removeBlockAndReward(target.row, target.col, points);
      } else {
        setLives((l) => {
          const next = l - 1;
          if (next <= 0) {
            window.setTimeout(() => setScreen("gameOver"), 200);
          } else {
            toast.error(t("ouch"));
            setScreen("playing");
          }
          return Math.max(0, next);
        });
      }
    },
    [pending, removeBlockAndReward, t],
  );

  const blocksLeft = useMemo(
    () => grid.reduce((acc, row) => acc + row.filter((b) => b.kind !== "air").length, 0),
    [grid],
  );

  return (
    <div className="min-h-screen sky-bg">
      <div className="mx-auto max-w-3xl px-4 py-4">
        {screen !== "title" && screen !== "gameOver" && screen !== "ageSelect" && screen !== "languageSelect" && (
          <>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h1 className="text-2xl font-extrabold text-foreground drop-shadow-sm">
                ⛏️ {t("title")}
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScreen("languageSelect")}
                  className="btn-pixel rounded-md bg-secondary px-3 py-1 text-xs font-bold"
                  aria-label={t("language")}
                >
                  🌍 {lang.toUpperCase()}
                </button>
                <button
                  onClick={() => setScreen("ageSelect")}
                  className="btn-pixel rounded-md bg-secondary px-3 py-1 text-xs font-bold"
                  aria-label={t("age")}
                >
                  {t("age")}: {age}
                </button>
              </div>
            </div>
            <HUD score={score} lives={lives} level={level} highScore={highScore} />
            <p
              className="mt-2 text-center text-xs text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: `${t("goalLine")} <strong>${blocksLeft}</strong>` }}
            />
            <div className="mt-4">
              <Mountain grid={grid} onMine={handleMine} />
            </div>
          </>
        )}

        {screen === "title" && <TitleScreen highScore={highScore} onStart={startGame} />}

        {screen === "languageSelect" && <LanguageSelect onPick={handleLanguagePick} />}

        {screen === "ageSelect" && <AgeSelect onPick={handleAgePick} />}

        {screen === "challenge" && challenge && (
          <ChallengeModal challenge={challenge} onResult={handleChallengeResult} />
        )}

        {screen === "combat" && combat && (
          <CombatModal monster={combat} onEnd={handleCombatEnd} />
        )}

        {screen === "levelComplete" && (
          <Overlay
            title={t("mountainCleared")}
            subtitle={t("finishedLevel", { n: level })}
            stats={[
              { label: t("score"), value: score },
              { label: t("lives"), value: `${lives} / ${MAX_LIVES}` },
            ]}
            actionLabel={t("nextLevel")}
            onAction={startNextLevel}
          />
        )}

        {screen === "gameOver" && (
          <Overlay
            title={t("gameOver")}
            subtitle={t("ranOutLives")}
            stats={[
              { label: t("finalScore"), value: score },
              { label: t("best"), value: highScore },
              { label: t("level"), value: level },
            ]}
            actionLabel={t("playAgain")}
            onAction={startGame}
          />
        )}
      </div>
    </div>
  );
}

function TitleScreen({ highScore, onStart }: { highScore: number; onStart: () => void }) {
  const { t } = useI18n();
  return (
    <div className="grid min-h-[80vh] place-items-center">
      <div className="w-full max-w-lg rounded-2xl border-4 border-primary bg-card p-8 text-center shadow-2xl animate-pop">
        <div className="mb-4 text-6xl">⛏️ ⛰️</div>
        <h1 className="text-4xl font-extrabold tracking-tight">{t("title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("tagline")}</p>
        <div className="my-6 rounded-lg bg-muted p-4 text-left text-sm">
          <p className="mb-1 font-bold">{t("howToPlay")}</p>
          <ul className="list-disc space-y-1 pl-5">
            {(["rule1", "rule2", "rule3", "rule4", "rule5"] as const).map((k) => (
              <li key={k} dangerouslySetInnerHTML={{ __html: t(k) }} />
            ))}
          </ul>
        </div>
        {highScore > 0 && (
          <p className="mb-4 text-sm text-muted-foreground">
            {t("bestScore")} <strong className="text-foreground">{highScore}</strong>
          </p>
        )}
        <button
          onClick={onStart}
          className="btn-pixel rounded-xl bg-primary px-8 py-4 text-2xl font-extrabold text-primary-foreground"
        >
          {t("startGame")}
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
