"use client";

/** @/components/board.tsx */

import { LucideBot, LucideUser } from "lucide-react";
import { useGameContext } from "@/hooks/use-game-context";
import { CRAWL_HOLE_INDEX, THEMES } from "@/lib/contants";
import Hole from "./hole";

interface BoardProps {
  player: 1 | 2;
}

export type BoardTheme = Record<
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

const Board: React.FC<BoardProps> = ({ player }) => {
  const {
    player1Board,
    player2Board,
    currentPlayer,
    makeMove,
    isProcessing,
    currentTheme,
    isVsCPU,
  } = useGameContext();
  const theme = THEMES[currentTheme];

  const board = player === 1 ? player1Board : player2Board;
  const isMyTurn = player === currentPlayer;
  const isCPUBoard = isVsCPU && player === 2;

  const isDisabled = !isMyTurn || isProcessing || isCPUBoard; // Disable clicks on CPU board

  return (
    <div
      className={`
        relative p-6 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-sm transition-all duration-500
        ${
          isMyTurn
            ? `ring-2 ring-${theme.primary}-500/50 shadow-2xl shadow-${theme.primary}-900/20 opacity-100 scale-100`
            : "opacity-60 scale-95 grayscale-[0.5]"
        }
    `}
    >
      <div className="absolute -top-4 left-6 px-4 py-1 bg-slate-900 border border-slate-800 rounded-full flex items-center gap-2 z-10">
        {isCPUBoard ? (
          <LucideBot
            size={14}
            className={
              isMyTurn ? `text-${theme.primary}-400` : "text-slate-500"
            }
          />
        ) : (
          <LucideUser
            size={14}
            className={
              isMyTurn ? `text-${theme.primary}-400` : "text-slate-500"
            }
          />
        )}
        <span
          className={`text-sm font-bold ${
            isMyTurn ? `text-${theme.primary}-400` : "text-slate-500"
          }`}
        >
          {isCPUBoard ? "CPU" : `Player ${player}`}
        </span>
        {isMyTurn && !isProcessing && (
          <span
            className={`flex h-2 w-2 rounded-full bg-${theme.primary}-500 animate-pulse`}
          />
        )}
        {isMyTurn && isProcessing && (
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-bounce" />
        )}
      </div>

      <div className="flex gap-3 items-center mt-2">
        <div className="grid grid-cols-5 gap-3">
          {board.map((stones, index) => {
            if (index === CRAWL_HOLE_INDEX) return null;
            return (
              <Hole
                // biome-ignore lint/suspicious/noArrayIndexKey: board positions are static
                key={index}
                index={index}
                stones={stones}
                isDisabled={isDisabled}
                isCrawlHole={false}
                onClick={makeMove}
              />
            );
          })}
        </div>
        <div className="w-px h-32 bg-white/10 mx-2" />
        <Hole
          index={CRAWL_HOLE_INDEX}
          stones={board[CRAWL_HOLE_INDEX]}
          isDisabled={true}
          isCrawlHole={true}
          onClick={() => {}}
        />
      </div>
    </div>
  );
};

export default Board;
