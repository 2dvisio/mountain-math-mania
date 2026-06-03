import { Block } from "./Block";
import type { Grid } from "@/game/types";
import { isAccessible } from "@/game/mountain";

interface Props {
  grid: Grid;
  onMine: (row: number, col: number) => void;
}

const BLOCK_SIZE = 52; // fixed; mountain scrolls when bigger than viewport

export function Mountain({ grid, onMine }: Props) {
  const cols = grid[0]?.length ?? 0;
  const rows = grid.length;

  return (
    <div className="rounded-lg sky-bg shadow-inner border-2 border-border overflow-auto max-h-[60vh]">
      <div className="p-3 inline-block min-w-full">
        <div className="mx-auto" style={{ width: cols * BLOCK_SIZE }}>
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${BLOCK_SIZE}px)`,
              gridAutoRows: `${BLOCK_SIZE}px`,
            }}
          >
            {grid.map((row, r) =>
              row.map((b, c) => (
                <Block
                  key={`${r}-${c}`}
                  block={b}
                  size={BLOCK_SIZE}
                  accessible={isAccessible(grid, r, c)}
                  onClick={() => onMine(r, c)}
                />
              )),
            )}
          </div>
          <div
            className="rounded-b"
            style={{
              width: cols * BLOCK_SIZE,
              height: 6,
              background: "var(--dirt-dark)",
            }}
            aria-hidden
          />
        </div>
        {rows > 7 || cols > 11 ? (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            ↔ scroll or swipe to see the whole mountain
          </p>
        ) : null}
      </div>
    </div>
  );
}
