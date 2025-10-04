import { GameBoard } from "@/components/globals/monoply/game-board";

export default function MonopolyGamePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-[1100px]">
        <GameBoard />
      </div>
    </main>
  );
}