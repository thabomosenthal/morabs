/** @/lib/types.ts */

export type GameAction =
  | {
      type: "SET_BEST_RECORD";
      payload: {
        rounds: number;
        player: string;
      };
    }
  | { type: "START_GAME" }
  | { type: "TOGGLE_ANIMATIONS" }
  | { type: "CYCLE_THEME" }
  | { type: "TOGGLE_SOUND" }
  | { type: "TOGGLE_CPU" }
  | { type: "TOGGLE_CPU_LEVEL" }
  | { type: "SET_PROCESSING"; isProcessing: boolean }
  | { type: "SET_TURN_LAPS"; count: number }
  | {
      type: "UPDATE_BOARD";
      player: number;
      board: number[];
    }
  | { type: "SET_WINNER"; winner: number | null }
  | { type: "SWITCH_PLAYER" };

export type GameState = {
  useAnimations: boolean;
  soundEnabled: boolean;
  isVsCPU: boolean;
  isProcessing: boolean;
  cpuLevel: number;
  currentTheme: keyof GameTheme;
  currentPlayer: number;
  currentTurnLaps: number;
  lastTurnStats: { player: number; laps: number };
  player1Board: number[];
  player2Board: number[];
  p1MaxLaps: number;
  p2MaxLaps: number;
  roundCount: number;
  bestRecord: { player: string; rounds: number } | null;
  winner: number | null;
};

export type GameTheme = Record<
  "emerald" | "blue" | "rose",
  {
    name: string;
    primary: string;
    bgGradient: string;
    boardBg: string;
    stoneColor: string;
    stonePop: string;
    crawlHole: string;
  }
>;
