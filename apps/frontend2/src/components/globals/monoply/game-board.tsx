"use client";

import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dice3D } from "@/components/globals/monoply/dice-3d";

// Types
type Side = "bottom" | "right" | "top" | "left";
type TileType = "city" | "tax" | "airport" | "treasure" | "surprise" | "corner";

type Tile = {
  id: number;
  label: string;
  price?: number;
  type: TileType;
};

// Helpers
const BOARD_SIZE = 11;

function indexToGrid(i: number): { row: number; col: number; side: Side } {
  // Order: start at bottom-left corner (row 11, col 1), move right (clockwise)
  if (i < 11) {
    // bottom row: cols 1..11
    return { row: BOARD_SIZE, col: i + 1, side: "bottom" };
  }
  if (i < 21) {
    // right col: rows 10..1 (exclude bottom-right corner already used)
    return { row: BOARD_SIZE - (i - 10), col: BOARD_SIZE, side: "right" };
  }
  if (i < 31) {
    // top row: cols 10..1 (exclude top-right corner)
    return { row: 1, col: BOARD_SIZE - (i - 20), side: "top" };
  }
  // left col: rows 2..10 (exclude top-left and bottom-left)
  return { row: i - 29, col: 1, side: "left" };
}

function isCorner(i: number) {
  return i === 0 || i === 10 || i === 20 || i === 30;
}

// Sample data (names/prices inspired by the reference image)
const TILES: Tile[] = [
  { id: 0, label: "START", type: "corner" },
  { id: 1, label: "Paris", price: 280, type: "city" },
  { id: 2, label: "Water Co.", type: "airport" },
  { id: 3, label: "Toulouse", price: 260, type: "city" },
  { id: 4, label: "Lyon", price: 260, type: "city" },
  { id: 5, label: "CDG Airport", price: 200, type: "airport" },
  { id: 6, label: "Shanghai", price: 240, type: "city" },
  { id: 7, label: "Beijing", price: 220, type: "city" },
  { id: 8, label: "Surprise", type: "surprise" },
  { id: 9, label: "Shenzhen", price: 220, type: "city" },
  { id: 10, label: "Vacation", type: "corner" },
  { id: 11, label: "Berlin", price: 200, type: "city" },
  { id: 12, label: "Munich", price: 180, type: "city" },
  { id: 13, label: "Treasure", type: "treasure" },
  { id: 14, label: "Frankfurt", price: 180, type: "city" },
  { id: 15, label: "MUC Airport", price: 200, type: "airport" },
  { id: 16, label: "Rome", price: 160, type: "city" },
  { id: 17, label: "Milan", price: 140, type: "city" },
  { id: 18, label: "Electric Co.", type: "tax" },
  { id: 19, label: "Venice", price: 140, type: "city" },
  { id: 20, label: "In Prison", type: "corner" },
  { id: 21, label: "Haifa", price: 100, type: "city" },
  { id: 22, label: "Surprise", type: "surprise" },
  { id: 23, label: "Jerusalem", price: 120, type: "city" },
  { id: 24, label: "Passing by", type: "tax" },
  { id: 25, label: "Tel Aviv", price: 100, type: "city" },
  { id: 26, label: "TLV Airport", price: 200, type: "airport" },
  { id: 27, label: "Income Tax", type: "tax" },
  { id: 28, label: "Rio", price: 60, type: "city" },
  { id: 29, label: "Treasure", type: "treasure" },
  { id: 30, label: "Go to prison", type: "corner" },
  { id: 31, label: "Liverpool", price: 300, type: "city" },
  { id: 32, label: "Manchester", price: 300, type: "city" },
  { id: 33, label: "Treasure", type: "treasure" },
  { id: 34, label: "London", price: 320, type: "city" },
  { id: 35, label: "JFK Airport", price: 200, type: "airport" },
  { id: 36, label: "Surprise", type: "surprise" },
  { id: 37, label: "San Francisco", price: 350, type: "city" },
  { id: 38, label: "Luxury Tax", type: "tax" },
  { id: 39, label: "New York", price: 400, type: "city" },
];

export function GameBoard() {
  const [dice, setDice] = useState<[number, number]>([1, 1]);
  const [rollKey, setRollKey] = useState(0);
  const tiles = useMemo(() => TILES, []);

  function roll() {
    setDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
    setRollKey((k) => k + 1);
  }

  return (
    <section
      aria-label="Game board"
      className="mx-auto rounded-xl bg-card shadow-sm border border-border p-4 md:p-6"
    >
      {/* Board grid */}
      <div
        className="relative grid bg-secondary rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          aspectRatio: "1 / 1",
        }}
      >
        {/* Tiles */}
        {tiles.map((tile, i) => {
          const { row, col, side } = indexToGrid(i);
          const corner = isCorner(i);
          return (
            <div
              key={tile.id}
              style={{ gridRow: row, gridColumn: col }}
              className={cn("p-1", corner ? "z-10" : "")}
            >
              <BoardTile tile={tile} side={side} corner={corner} />
            </div>
          );
        })}

        {/* Center content */}
        <div
          className="absolute inset-[12%] md:inset-[10%] rounded-lg  border border-border p-4 md:p-8 flex flex-col items-center justify-center gap-6 text-center"
          aria-label="Board center"
        >
          {/* 3D Dice */}
          <div className="w-[280px] h-[200px] md:w-[360px] md:h-[240px">
            <Dice3D
              a={dice[0]}
              b={dice[1]}
              rollKey={rollKey}
            />
          </div>
          <Button variant="secondary" onClick={roll} aria-label="Start or roll">
            Start Game
          </Button>
          <p className="text-sm text-muted-foreground">
            Click to roll the dice
          </p>
        </div>
      </div>

      {/* Optional: reference image for comparison */}
      <details className="mt-4 text-sm text-muted-foreground">
        <summary className="cursor-pointer">Show reference image</summary>
        <div className="mt-2 rounded-md overflow-hidden border border-border">
          <img
            src="/images/reference-board.png"
            alt="Reference board design"
            className="w-full h-auto"
          />
        </div>
      </details>
    </section>
  );
}

// Tile component
function BoardTile({
  tile,
  side,
  corner,
}: {
  tile: Tile;
  side: Side;
  corner: boolean;
}) {
  const palette = getPalette(tile.type);

  return (
    <div
      className={cn(
        "h-full w-full rounded-md border px-2 py-2",
        "bg-card text-card-foreground border-border",
        "flex items-stretch justify-stretch"
      )}
      role="group"
      aria-label={tile.label}
    >
      <div
        className={cn(
          "relative flex-1 rounded-md",
          "bg-gradient-to-b from-transparent to-muted/30",
          side === "left" || side === "right" ? "flex" : "",
          corner ? "p-2" : "p-1"
        )}
      >
        {/* Header stripe */}
        <div
          className={cn(
            "absolute",
            side === "top" && "top-0 left-0 right-0 h-6 rounded-t-md",
            side === "bottom" && "bottom-0 left-0 right-0 h-6 rounded-b-md",
            side === "left" && "left-0 top-0 bottom-0 w-6 rounded-l-md",
            side === "right" && "right-0 top-0 bottom-0 w-6 rounded-r-md",
            palette.bg
          )}
          aria-hidden
        />
        {/* Content */}
        <div
          className={cn(
            "relative z-[1] h-full w-full",
            corner
              ? "flex flex-col items-center justify-center text-center gap-1"
              : side === "top" || side === "bottom"
                ? "flex flex-col items-center justify-center text-center gap-1 pt-6"
                : "flex items-center justify-center [writing-mode:vertical-rl] rotate-180 pr-1"
          )}
        >
          <span
            className={cn(
              "text-xs font-semibold",
              palette.fg,
              corner && "text-sm"
            )}
          >
            {tile.type === "treasure" || tile.type === "surprise"
              ? tile.type === "treasure"
                ? "Treasure"
                : "Surprise"
              : tile.type === "tax"
                ? "Fee/Tax"
                : tile.type === "airport"
                  ? "Airport"
                  : corner
                    ? ""
                    : tile.price
                      ? `${tile.price}$`
                      : ""}
          </span>
          <span
            className={cn(
              "text-sm md:text-base font-medium max-w-[9ch] text-pretty"
            )}
          >
            {tile.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function getPalette(type: TileType) {
  switch (type) {
    case "city":
      return { bg: "bg-primary/20", fg: "text-primary" };
    case "airport":
      return { bg: "bg-accent/40", fg: "text-accent-foreground" };
    case "tax":
      return { bg: "bg-destructive/30", fg: "text-destructive-foreground" };
    case "treasure":
      return { bg: "bg-chart-4/40", fg: "text-foreground" };
    case "surprise":
      return { bg: "bg-chart-5/40", fg: "text-foreground" };
    case "corner":
      return { bg: "bg-muted/60", fg: "text-muted-foreground" };
    default:
      return { bg: "bg-muted/60", fg: "text-muted-foreground" };
  }
}
