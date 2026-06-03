import { useEffect, useState } from "react";
import { Block } from "./Block";
import type { Grid } from "@/game/types";
import { isAccessible } from "@/game/mountain";

interface Props {
  grid: Grid;
  onMine: (row: number, col: number) => void;
}

export function Mountain({ grid, onMine }: Props) {
  const [size, setSize] = useState(48);

  useEffect(() => {
    function update() {
      const cols = grid[0]?.length ?? 1;
      const rows = grid.length;
      const maxW = Math.min(window.innerWidth - 32, 720);
      const maxH = Math.min(window.innerHeight - 220, 560);
      const s = Math.floor(Math.min(maxW / cols, maxH / rows));
      setSize(Math.max(28, Math.min(64, s)));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [grid]);

  const cols = grid[0]?.length ?? 0;

  return (
    <div
      className="mx-auto rounded-lg p-2 sky-bg shadow-inner"
      style={{ width: cols * size + 16 }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${size}px)`,
          gridAutoRows: `${size}px`,
        }}
      >
        {grid.map((row, r) =>
          row.map((b, c) => (
            <Block
              key={`${r}-${c}`}
              block={b}
              size={size}
              accessible={isAccessible(grid, r, c)}
              onClick={() => onMine(r, c)}
            />
          )),
        )}
      </div>
      {/* ground line */}
      <div
        className="mx-auto mt-0 rounded-b"
        style={{
          width: cols * size,
          height: 6,
          background: "var(--dirt-dark)",
        }}
      />
    </div>
  );
}
