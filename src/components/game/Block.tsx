import type { Block as BlockData, BlockKind } from "@/game/types";

const KIND_STYLES: Record<Exclude<BlockKind, "air">, { bg: string; pattern: string; label: string }> = {
  grass: { bg: "bg-grass", pattern: "linear-gradient(to bottom, var(--grass) 35%, var(--dirt) 35%)", label: "grass" },
  dirt: { bg: "bg-dirt", pattern: "", label: "dirt" },
  stone: { bg: "bg-stone", pattern: "", label: "stone" },
  coal: { bg: "bg-stone", pattern: "", label: "coal" },
  iron: { bg: "bg-stone", pattern: "", label: "iron" },
  gold: { bg: "bg-stone", pattern: "", label: "gold" },
  diamond: { bg: "bg-stone", pattern: "", label: "diamond" },
  goal: { bg: "", pattern: "", label: "goal" },
};

const ORE_DOTS: Partial<Record<BlockKind, string>> = {
  coal: "var(--coal)",
  iron: "var(--iron)",
  gold: "var(--gold)",
  diamond: "var(--diamond)",
};

interface Props {
  block: BlockData;
  size: number;
  accessible: boolean;
  onClick?: () => void;
}

export function Block({ block, size, accessible, onClick }: Props) {
  if (block.kind === "air") {
    return <div style={{ width: size, height: size }} />;
  }
  const style = KIND_STYLES[block.kind];
  const oreColor = ORE_DOTS[block.kind];
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!accessible}
      aria-label={`${style.label} block${accessible ? ", click to mine" : ""}`}
      className={`relative block-shadow-sm ${style.bg} ${
        accessible
          ? "cursor-pointer hover:brightness-110 ring-0 hover:ring-2 hover:ring-accent z-10"
          : "cursor-not-allowed opacity-95"
      }`}
      style={{
        width: size,
        height: size,
        background: style.pattern || undefined,
        backgroundColor: style.pattern ? undefined : `var(--${block.kind === "grass" ? "grass" : block.kind === "dirt" ? "dirt" : "stone"})`,
      }}
    >
      {oreColor && (
        <span
          className="absolute inset-0 grid place-items-center pointer-events-none"
          aria-hidden
        >
          <span
            style={{
              width: size * 0.55,
              height: size * 0.55,
              background: oreColor,
              boxShadow: "inset 1px 1px 0 rgb(255 255 255 / 0.35), inset -1px -1px 0 rgb(0 0 0 / 0.3)",
              borderRadius: 2,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 1,
              padding: 2,
            }}
          >
            <span style={{ background: "rgb(255 255 255 / 0.4)" }} />
            <span />
            <span />
            <span style={{ background: "rgb(0 0 0 / 0.25)" }} />
          </span>
        </span>
      )}
    </button>
  );
}
