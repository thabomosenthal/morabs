/** @/components/game-provider.tsx */
"use client";

import React from "react";
import { getBestAIMove } from "@/game-engine/ai";
import { gameReducer, initialState } from "@/game-engine/reducer";
import { calculateMove } from "@/game-engine/rules";
import { useSound } from "@/hooks/use-sound";
import { CRAWL_HOLE_INDEX, STORAGE_KEY } from "@/lib/contants";
import type { GameState } from "@/lib/types";
import { sleep } from "@/utils";

const checkGameOver = (p1Board: number[], p2Board: number[]) => {
  const p1Sum = p1Board.reduce(
    (acc, val, idx) => (idx !== CRAWL_HOLE_INDEX ? acc + val : acc),
    0,
  );
  const p2Sum = p2Board.reduce(
    (acc, val, idx) => (idx !== CRAWL_HOLE_INDEX ? acc + val : acc),
    0,
  );

  if (p1Sum === 0 && p1Board[CRAWL_HOLE_INDEX] > 0) return 1;
  if (p2Sum === 0 && p2Board[CRAWL_HOLE_INDEX] > 0) return 2;
  return null;
};

interface ContextProps extends GameState {
  makeMove: (holeIndex: number) => Promise<void>;
  startGame: () => void;
  toggleAnimations: () => void;
  toggleSound: () => void;
  toggleCPU: () => void;
  toggleCPULevel: () => void;
  cycleTheme: () => void;
}

export const GameContext = React.createContext<ContextProps | undefined>(
  undefined,
);

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(gameReducer, initialState);
  const { playPopSound } = useSound(state.soundEnabled);

  const stateRef = React.useRef(state);
  React.useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Load Record
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored)
        dispatch({ type: "SET_BEST_RECORD", payload: JSON.parse(stored) });
    } catch (e) {
      console.error("Failed to load best record from localStorage", e);
    }
  }, []);

  // Save Record
  React.useEffect(() => {
    if (state.winner) {
      const { roundCount, winner, bestRecord } = state;
      if (!bestRecord || roundCount < bestRecord.rounds) {
        const newRecord = { rounds: roundCount, player: `Player ${winner}` };
        dispatch({ type: "SET_BEST_RECORD", payload: newRecord });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecord));
      }
    }
  }, [state.winner, state]);

  const checkWinAndSwitch = React.useCallback(
    async (isP1: boolean, finalBoard: number[]) => {
      const win = checkGameOver(
        isP1 ? finalBoard : stateRef.current.player1Board,
        !isP1 ? finalBoard : stateRef.current.player2Board,
      );
      if (win) {
        dispatch({ type: "SET_WINNER", winner: win });
      } else {
        dispatch({ type: "SWITCH_PLAYER" });
      }
    },
    [],
  );

  const handleMove = React.useCallback(
    async (holeIndex: number) => {
      if (stateRef.current.winner || stateRef.current.isProcessing) return;

      const isP1 = stateRef.current.currentPlayer === 1;
      let activeBoard = isP1
        ? [...stateRef.current.player1Board]
        : [...stateRef.current.player2Board];

      if (holeIndex === CRAWL_HOLE_INDEX || activeBoard[holeIndex] === 0)
        return;

      dispatch({ type: "SET_PROCESSING", isProcessing: true });

      let turnActive = true;
      let currentIndex = holeIndex;
      let lapsInThisTurn = 0;

      while (turnActive) {
        lapsInThisTurn++;
        dispatch({ type: "SET_TURN_LAPS", count: lapsInThisTurn });

        const { newBoard, lastIndex } = calculateMove(
          activeBoard,
          currentIndex,
        );

        activeBoard = newBoard;
        currentIndex = lastIndex;

        dispatch({
          type: "UPDATE_BOARD",
          player: stateRef.current.currentPlayer,
          board: activeBoard,
        });

        // Sound Effect
        playPopSound();

        if (stateRef.current.useAnimations) await sleep(600);

        if (
          currentIndex === CRAWL_HOLE_INDEX ||
          activeBoard[currentIndex] === 1
        ) {
          turnActive = false;
          await checkWinAndSwitch(isP1, activeBoard);
        } else {
          if (stateRef.current.useAnimations) await sleep(200);
        }
      }

      dispatch({ type: "SET_PROCESSING", isProcessing: false });
    },
    [
      checkWinAndSwitch, // Sound Effect
      playPopSound,
    ],
  );

  // AI Turn Effect
  React.useEffect(() => {
    if (
      !state.winner &&
      state.isVsCPU &&
      state.currentPlayer === 2 &&
      !state.isProcessing
    ) {
      // Trigger AI move
      const timer = setTimeout(() => {
        // Pass AI Level and Round Count to decision maker
        const aiMoveIndex = getBestAIMove(
          state.player2Board,
          state.cpuLevel,
          state.roundCount,
        );

        if (aiMoveIndex !== -1) {
          handleMove(aiMoveIndex);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [
    state.currentPlayer,
    state.isProcessing,
    state.winner,
    state.isVsCPU,
    state.cpuLevel,
    state.roundCount,
    handleMove,
    state.player2Board,
  ]);

  const startGame = () => dispatch({ type: "START_GAME" });
  const toggleAnimations = () => dispatch({ type: "TOGGLE_ANIMATIONS" });
  const toggleSound = () => dispatch({ type: "TOGGLE_SOUND" });
  const toggleCPU = () => dispatch({ type: "TOGGLE_CPU" });
  const toggleCPULevel = () => dispatch({ type: "TOGGLE_CPU_LEVEL" });
  const cycleTheme = () => dispatch({ type: "CYCLE_THEME" });

  return (
    <GameContext.Provider
      value={{
        ...state,
        makeMove: handleMove,
        startGame,
        toggleAnimations,
        toggleSound,
        toggleCPU,
        toggleCPULevel,
        cycleTheme,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
