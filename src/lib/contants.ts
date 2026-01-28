/** @/lib/contants.ts */

import { INITIAL_BOARD } from "@/game-engine/rules";

// --- Assets & Constants ---

const CRAWL_HOLE_INDEX = INITIAL_BOARD.length - 1;
const STORAGE_KEY = "MORABS_BEST_RECORD_V2";
const TOTAL_STONES = 50;

// Simple "Pop" Sound (Base64 encoded small wav file for portability)
const POP_SOUND =
  "data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU";

// Theme Palettes
const THEMES = {
  emerald: {
    name: "Classic",
    primary: "emerald",
    bgGradient: "from-emerald-200 to-emerald-600",
    boardBg: "bg-emerald-900/40",
    stoneColor: "bg-emerald-200",
    stonePop: "bg-emerald-900/40 ring-emerald-500/50",
    crawlHole: "bg-emerald-400",
  },
  blue: {
    name: "Ocean",
    primary: "cyan",
    bgGradient: "from-cyan-200 to-blue-600",
    boardBg: "bg-cyan-900/40",
    stoneColor: "bg-cyan-200",
    stonePop: "bg-cyan-900/40 ring-cyan-500/50",
    crawlHole: "bg-blue-400",
  },
  rose: {
    name: "Sunset",
    primary: "rose",
    bgGradient: "from-orange-200 to-rose-600",
    boardBg: "bg-rose-900/40",
    stoneColor: "bg-orange-200",
    stonePop: "bg-rose-900/40 ring-rose-500/50",
    crawlHole: "bg-rose-400",
  },
};

export {
  INITIAL_BOARD,
  CRAWL_HOLE_INDEX,
  STORAGE_KEY,
  TOTAL_STONES,
  POP_SOUND,
  THEMES,
};
