interface Props {
  onPick: (age: number) => void;
}

const AGES = [6, 7, 8, 9];

export function AgeSelect({ onPick }: Props) {
  return (
    <div className="grid min-h-[80vh] place-items-center">
      <div className="w-full max-w-lg rounded-2xl border-4 border-primary bg-card p-8 text-center shadow-2xl animate-pop">
        <div className="mb-3 text-5xl">🎂</div>
        <h2 className="text-3xl font-extrabold">How old are you?</h2>
        <p className="mt-2 text-muted-foreground">
          We pick math and puzzles that are just right for your age.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {AGES.map((age) => (
            <button
              key={age}
              onClick={() => onPick(age)}
              className="btn-pixel rounded-xl bg-primary px-4 py-6 text-3xl font-extrabold text-primary-foreground"
            >
              {age}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">You can change this anytime.</p>
      </div>
    </div>
  );
}
