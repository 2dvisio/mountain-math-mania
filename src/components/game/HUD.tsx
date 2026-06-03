import { Heart } from "lucide-react";
import { MAX_LIVES } from "@/game/types";
import { useI18n } from "@/i18n";

interface Props {
  score: number;
  lives: number;
  level: number;
  highScore: number;
}

export function HUD({ score, lives, level, highScore }: Props) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-card px-4 py-3 shadow border-2 border-border">
      <div className="flex items-center gap-2 text-lg font-bold">
        <span className="rounded bg-primary px-2 py-1 text-primary-foreground text-sm">
          {t("level").toUpperCase()} {level}
        </span>
        <span className="text-muted-foreground text-sm hidden sm:inline">{t("best")}: {highScore}</span>
      </div>
      <div className="flex items-center gap-1" aria-label={t("ofLives", { n: lives, m: MAX_LIVES })}>
        {Array.from({ length: MAX_LIVES }).map((_, i) => (
          <Heart
            key={i}
            className={i < lives ? "fill-[var(--heart)] stroke-[var(--heart)]" : "stroke-muted-foreground opacity-40"}
            size={18}
          />
        ))}
      </div>
      <div className="text-xl font-extrabold tabular-nums">
        <span className="text-accent-foreground bg-accent px-3 py-1 rounded">★ {score}</span>
      </div>
    </div>
  );
}
