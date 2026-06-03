import { useEffect, useRef, useState } from "react";
import { MONSTER_HP, MONSTER_POINTS, type MonsterKind } from "@/game/types";
import { useI18n } from "@/i18n";

interface Props {
  monster: MonsterKind;
  onEnd: (result: { won: boolean; points: number }) => void;
}

const MONSTER_EMOJI: Record<MonsterKind, string> = {
  zombie: "🧟",
  skeleton: "💀",
  enderman: "👾",
};

export function CombatModal({ monster, onEnd }: Props) {
  const { t } = useI18n();
  const monsterName = t(monster);
  const maxHp = MONSTER_HP[monster];
  const [hp, setHp] = useState(maxHp);
  const [attacks, setAttacks] = useState(0);
  const [hitFlash, setHitFlash] = useState(false);
  const [enemyFlash, setEnemyFlash] = useState(false);
  const ended = useRef(false);

  // Monster auto-attacks
  useEffect(() => {
    if (ended.current) return;
    const id = window.setInterval(() => {
      setAttacks((a) => {
        const next = a + 1;
        setEnemyFlash(true);
        setTimeout(() => setEnemyFlash(false), 250);
        if (next >= 3 && !ended.current) {
          ended.current = true;
          window.setTimeout(() => onEnd({ won: false, points: 0 }), 400);
        }
        return next;
      });
    }, 2200);
    return () => window.clearInterval(id);
  }, [onEnd]);

  function hit() {
    if (ended.current) return;
    setHp((h) => {
      const next = Math.max(0, h - 1);
      setHitFlash(true);
      setTimeout(() => setHitFlash(false), 120);
      if (next === 0 && !ended.current) {
        ended.current = true;
        window.setTimeout(() => onEnd({ won: true, points: MONSTER_POINTS[monster] }), 400);
      }
      return next;
    });
  }

  const hpPct = (hp / maxHp) * 100;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl border-4 border-destructive animate-pop">
        <h2 className="mb-2 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
          A {MONSTER_NAME[monster]} Appeared!
        </h2>

        <div className="mb-3 h-4 w-full overflow-hidden rounded-full bg-muted border-2 border-border">
          <div
            className="h-full bg-destructive transition-all duration-200"
            style={{ width: `${hpPct}%` }}
          />
        </div>

        <button
          type="button"
          onClick={hit}
          className={`btn-pixel relative mx-auto mb-4 grid h-44 w-44 place-items-center rounded-xl bg-muted text-8xl ${hitFlash ? "brightness-150" : ""} ${enemyFlash ? "animate-shake" : ""}`}
          aria-label={`Attack the ${MONSTER_NAME[monster]}`}
        >
          {MONSTER_EMOJI[monster]}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Tap the monster fast! HP: <strong>{hp}</strong> / {maxHp}
        </p>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          Monster attacks left until you lose a life: <strong>{Math.max(0, 3 - attacks)}</strong>
        </p>
      </div>
    </div>
  );
}
