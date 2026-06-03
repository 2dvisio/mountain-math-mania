import { useState } from "react";
import type { Challenge, PuzzleChallenge } from "@/game/challenges";

interface Props {
  challenge: Challenge;
  onResult: (correct: boolean) => void;
}

export function ChallengeModal({ challenge, onResult }: Props) {
  const [picked, setPicked] = useState<string | number | null>(null);
  const [shake, setShake] = useState(false);

  function pickOpt(value: string | number) {
    if (picked !== null) return;
    setPicked(value);
    const correct = value === challenge.answer;
    if (!correct) setShake(true);
    setTimeout(() => onResult(correct), 750);
  }

  const isMath = challenge.type === "math";
  const puzzle = !isMath ? (challenge as PuzzleChallenge) : null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4">
      <div
        className={`w-full max-w-md rounded-xl bg-card p-6 shadow-2xl border-4 border-primary ${shake ? "animate-shake" : "animate-pop"}`}
      >
        <h2 className="mb-1 text-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
          {isMath ? "Math Challenge" : "Puzzle Challenge"}
        </h2>
        <p className="mb-4 text-center text-2xl font-extrabold">{challenge.prompt}</p>

        {puzzle?.variant === "sequence" && puzzle.sequence && (
          <div className="mb-4 flex flex-wrap justify-center gap-2 text-3xl">
            {puzzle.sequence.map((s, i) => (
              <span key={i} className="rounded bg-muted px-2 py-1 min-w-[2.5rem] text-center">
                {s}
              </span>
            ))}
            <span className="rounded bg-accent px-2 py-1 text-accent-foreground min-w-[2.5rem] text-center">
              ?
            </span>
          </div>
        )}

        {puzzle?.variant === "numberSeq" && puzzle.sequence && (
          <div className="mb-4 flex flex-wrap justify-center gap-2 text-2xl font-bold">
            {puzzle.sequence.map((s, i) => (
              <span key={i} className="rounded bg-muted px-3 py-2 tabular-nums">
                {s}
              </span>
            ))}
            <span className="rounded bg-accent px-3 py-2 text-accent-foreground">?</span>
          </div>
        )}

        {puzzle?.variant === "shape" && puzzle.target && (
          <div className="mb-4 grid place-items-center">
            <span className="text-6xl">{puzzle.target}</span>
          </div>
        )}

        {puzzle?.variant === "oddOneOut" && (
          <p className="mb-2 text-center text-sm text-muted-foreground">
            Pick the one that's different
          </p>
        )}

        {puzzle?.variant === "analogy" && puzzle.analogy && (
          <div className="mb-4 flex justify-center items-center gap-2 text-3xl">
            <span className="rounded bg-muted px-2 py-1">{puzzle.analogy.a}</span>
            <span className="text-base font-bold">→</span>
            <span className="rounded bg-muted px-2 py-1">{puzzle.analogy.b}</span>
            <span className="text-base mx-1">,</span>
            <span className="rounded bg-muted px-2 py-1">{puzzle.analogy.c}</span>
            <span className="text-base font-bold">→</span>
            <span className="rounded bg-accent px-2 py-1 text-accent-foreground">?</span>
          </div>
        )}

        <div className={`grid gap-3 ${isMath ? "grid-cols-2" : "grid-cols-4"}`}>
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
                onClick={() => pickOpt(opt)}
                disabled={picked !== null}
                className={`btn-pixel rounded-lg py-4 ${isMath ? "text-2xl" : "text-3xl"} font-bold ${cls}`}
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
