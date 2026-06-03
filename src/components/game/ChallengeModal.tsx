import { useState } from "react";
import type { Challenge } from "@/game/challenges";

interface Props {
  challenge: Challenge;
  onResult: (correct: boolean) => void;
}

export function ChallengeModal({ challenge, onResult }: Props) {
  const [picked, setPicked] = useState<string | number | null>(null);
  const [shake, setShake] = useState(false);

  function pick(value: string | number) {
    if (picked !== null) return;
    setPicked(value);
    const correct = value === challenge.answer;
    if (!correct) setShake(true);
    setTimeout(() => onResult(correct), 700);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div
        className={`w-full max-w-md rounded-xl bg-card p-6 shadow-2xl border-4 border-primary ${shake ? "animate-shake" : "animate-pop"}`}
      >
        <h2 className="mb-1 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Solve to Mine!
        </h2>
        <p className="mb-4 text-center text-2xl font-extrabold">
          {challenge.prompt}
        </p>

        {challenge.type === "pattern" && (
          <div className="mb-4 flex justify-center gap-2 text-4xl">
            {challenge.sequence.map((s, i) => (
              <span key={i} className="rounded bg-muted px-2 py-1">{s}</span>
            ))}
            <span className="rounded bg-accent px-2 py-1 text-accent-foreground">?</span>
          </div>
        )}

        {challenge.type === "shape" && (
          <div className="mb-4 grid place-items-center">
            <span className="text-6xl">{challenge.target}</span>
          </div>
        )}

        <div className={`grid gap-3 ${challenge.type === "math" ? "grid-cols-2" : "grid-cols-4"}`}>
          {challenge.options.map((opt, i) => {
            const isPicked = picked === opt;
            const isCorrect = opt === challenge.answer;
            let cls = "bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground";
            if (picked !== null) {
              if (isCorrect) cls = "bg-primary text-primary-foreground";
              else if (isPicked) cls = "bg-destructive text-destructive-foreground";
              else cls = "bg-secondary text-secondary-foreground opacity-60";
            }
            return (
              <button
                key={i}
                onClick={() => pick(opt)}
                disabled={picked !== null}
                className={`btn-pixel rounded-lg py-4 text-2xl font-bold ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
