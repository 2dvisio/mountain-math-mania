import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Game } from "@/components/game/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Minecraft Mountain — Mine, Solve, Conquer" },
      {
        name: "description",
        content:
          "A kid-friendly mining game for ages 6-9. Solve math and puzzles to mine a Minecraft mountain, collect treasure, and beat monsters.",
      },
      { property: "og:title", content: "Minecraft Mountain" },
      {
        property: "og:description",
        content: "Mine a blocky mountain. Solve math, grab diamonds, beat monsters!",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Game />
      <Toaster position="top-center" richColors />
    </>
  );
}
