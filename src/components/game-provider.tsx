"use client";
/** @/components/game-provider.tsx */

import React from "react";

import {
	CRAWL_HOLE_INDEX,
	INITIAL_BOARD,
	STORAGE_KEY,
	THEMES,
	TOTAL_STONES,
} from "@/lib/contants";
import { sleep } from "@/utils";

import { GameAction, GameState, GameTheme } from "@/lib/types";

const checkGameOver = (p1Board: number[], p2Board: number[]) => {
	const p1Sum = p1Board.reduce(
		(acc, val, idx) => (idx !== CRAWL_HOLE_INDEX ? acc + val : acc),
		0
	);
	const p2Sum = p2Board.reduce(
		(acc, val, idx) => (idx !== CRAWL_HOLE_INDEX ? acc + val : acc),
		0
	);

	if (p1Sum === 0 && p1Board[CRAWL_HOLE_INDEX] > 0) return 1;
	if (p2Sum === 0 && p2Board[CRAWL_HOLE_INDEX] > 0) return 2;
	return null;
};

const getBestAIMove = (board: number[], level: number, roundCount: number) => {
	const validMoves = board
		.map((stones, idx) => ({ stones, idx }))
		.filter((m) => m.idx !== CRAWL_HOLE_INDEX && m.stones > 0);

	if (validMoves.length === 0) return -1;

	// By default, consider all valid moves for standard heuristics
	let movesToConsider = validMoves;

	// --- Level 2 Strategy ---
	if (level === 2) {
		const aiScore = board[CRAWL_HOLE_INDEX];

		// Strategy A: "Builder" (Maximize Laps)
		// Used in early game or when behind/building score (< 2/3 total)
		const isBuilderPhase = roundCount <= 3 || aiScore < (TOTAL_STONES * 2) / 3;

		if (isBuilderPhase) {
			let bestMove = null;
			let maxLaps = -1;

			for (let move of validMoves) {
				const stats = simulateTurnStats(board, move.idx);
				if (stats.laps > maxLaps) {
					maxLaps = stats.laps;
					bestMove = move.idx;
				}
			}

			// If we found a move that generates multiple laps, take it immediately
			if (maxLaps > 1 && bestMove !== null) {
				return bestMove;
			}
		}
		// Strategy B: "Closer" (Minimize Laps)
		// Used when winning (>= 2/3 total) to finish cleanly
		else {
			let minLaps = Infinity;

			// Calculate laps for all moves
			const movesWithStats = validMoves.map((move) => {
				const stats = simulateTurnStats(board, move.idx);
				if (stats.laps < minLaps) minLaps = stats.laps;
				return { ...move, laps: stats.laps };
			});

			// Filter: Only consider moves that are the most efficient (lowest laps)
			movesToConsider = movesWithStats.filter((m) => m.laps === minLaps);
		}
	}

	// --- Standard Heuristics (Level 1 / Fallthrough) ---
	// Applied to `movesToConsider` (which might be filtered by Level 2 "Closer" strategy)

	// 1. Check for crawl-hole landing
	for (let move of movesToConsider) {
		let index = move.idx;
		let stones = move.stones;
		let targetIndex = (index + stones) % board.length;
		if (targetIndex === CRAWL_HOLE_INDEX) return move.idx;
	}

	// 2. Check for capturing empty spot
	for (let move of movesToConsider) {
		let index = move.idx;
		let stones = move.stones;
		let targetIndex = (index + stones) % board.length;
		if (board[targetIndex] === 0 && targetIndex !== CRAWL_HOLE_INDEX)
			return move.idx;
	}

	// 3. Fallback: Pick random valid move from the considered set
	const randomMove =
		movesToConsider[Math.floor(Math.random() * movesToConsider.length)];
	return randomMove.idx;
};

const calculateMove = (board: number[], startIndex: number) => {
	let currentBoard = [...board];
	let hand = currentBoard[startIndex];
	currentBoard[startIndex] = 0;

	let currIndex = startIndex;
	while (hand > 0) {
		currIndex = (currIndex + 1) % currentBoard.length;
		currentBoard[currIndex]++;
		hand--;
	}
	return { newBoard: currentBoard, lastIndex: currIndex };
};

const simulateTurnStats = (board: number[], startIndex: number) => {
	let activeBoard = [...board];
	let currentIndex = startIndex;
	let turnActive = true;
	let laps = 0;

	// Safety break to prevent infinite loops in bad simulations
	let safeGuard = 0;

	while (turnActive && safeGuard < 50) {
		safeGuard++;
		laps++;
		const { newBoard, lastIndex } = calculateMove(activeBoard, currentIndex);
		activeBoard = newBoard;
		currentIndex = lastIndex;

		// Check end conditions matching game rules
		if (currentIndex === CRAWL_HOLE_INDEX || activeBoard[currentIndex] === 1) {
			turnActive = false;
		}
		// Else continues (landed in occupied hole)
	}

	return { laps, finalBoard: activeBoard };
};

const gameReducer = (state: GameState, action: GameAction) => {
	switch (action.type) {
		case "START_GAME":
			return {
				...state,
				player1Board: [...INITIAL_BOARD],
				player2Board: [...INITIAL_BOARD],
				currentPlayer: 1,
				winner: null,
				roundCount: 1,
				currentTurnLaps: 0,
				lastTurnStats: { player: 2, laps: 0 },
				p1MaxLaps: 0,
				p2MaxLaps: 0,
			};

		case "SET_PROCESSING":
			return { ...state, isProcessing: action.isProcessing };
		case "TOGGLE_ANIMATIONS":
			return { ...state, useAnimations: !state.useAnimations };
		case "TOGGLE_SOUND":
			return { ...state, soundEnabled: !state.soundEnabled };
		case "TOGGLE_CPU":
			return { ...state, isVsCPU: !state.isVsCPU };

		case "TOGGLE_CPU_LEVEL":
			return { ...state, cpuLevel: state.cpuLevel === 1 ? 2 : 1 };

		case "CYCLE_THEME":
			const themes = Object.keys(THEMES) as (keyof GameTheme)[];
			const nextIdx = (themes.indexOf(state.currentTheme) + 1) % themes.length;
			return { ...state, currentTheme: themes[nextIdx] };

		case "UPDATE_BOARD":
			return {
				...state,
				[action.player === 1 ? "player1Board" : "player2Board"]: action.board,
			};

		case "SET_TURN_LAPS":
			return { ...state, currentTurnLaps: action.count };

		case "SWITCH_PLAYER": {
			const nextPlayer = state.currentPlayer === 1 ? 2 : 1;
			const currentLaps = state.currentTurnLaps;
			const isP1 = state.currentPlayer === 1;
			const newP1Max = isP1
				? Math.max(state.p1MaxLaps, currentLaps)
				: state.p1MaxLaps;
			const newP2Max = !isP1
				? Math.max(state.p2MaxLaps, currentLaps)
				: state.p2MaxLaps;

			return {
				...state,
				currentPlayer: nextPlayer,
				roundCount: nextPlayer === 1 ? state.roundCount + 1 : state.roundCount,
				lastTurnStats: {
					player: state.currentPlayer,
					laps: state.currentTurnLaps,
				},
				currentTurnLaps: 0,
				p1MaxLaps: newP1Max,
				p2MaxLaps: newP2Max,
			};
		}

		case "SET_WINNER": {
			const finishingLaps = state.currentTurnLaps;
			const finisherIsP1 = state.currentPlayer === 1;
			const finalP1Max = finisherIsP1
				? Math.max(state.p1MaxLaps, finishingLaps)
				: state.p1MaxLaps;
			const finalP2Max = !finisherIsP1
				? Math.max(state.p2MaxLaps, finishingLaps)
				: state.p2MaxLaps;
			return {
				...state,
				winner: action.winner,
				p1MaxLaps: finalP1Max,
				p2MaxLaps: finalP2Max,
			};
		}

		case "SET_BEST_RECORD":
			return { ...state, bestRecord: action.payload };

		default:
			return state;
	}
};

const initialState = {
	player1Board: [...INITIAL_BOARD],
	player2Board: [...INITIAL_BOARD],
	currentPlayer: 1,
	winner: null,
	isProcessing: false,
	roundCount: 1,
	currentTurnLaps: 0,
	lastTurnStats: { player: 2, laps: 0 },
	p1MaxLaps: 0,
	p2MaxLaps: 0,
	bestRecord: null,
	// Settings
	useAnimations: true,
	soundEnabled: true,
	isVsCPU: false,
	cpuLevel: 1, // 1 or 2
	currentTheme: "emerald" as keyof GameTheme,
};

const playSound = (enabled: boolean) => {
	if (!enabled) return;
	try {
		const AudioContext = window.AudioContext;
		if (AudioContext) {
			const ctx = new AudioContext();
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.type = "sine";
			osc.frequency.setValueAtTime(800, ctx.currentTime);
			osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);

			gain.gain.setValueAtTime(0.1, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

			osc.start();
			osc.stop(ctx.currentTime + 0.1);
		}
	} catch (e) {
		// Fallback
	}
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
	undefined
);

const GameProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = React.useReducer(gameReducer, initialState);
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
		} catch (e) {}
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
	}, [state.winner]);

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
					state.roundCount
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
	]);

	const handleMove = async (holeIndex: number) => {
		if (stateRef.current.winner || stateRef.current.isProcessing) return;

		const isP1 = stateRef.current.currentPlayer === 1;
		let activeBoard = isP1
			? [...stateRef.current.player1Board]
			: [...stateRef.current.player2Board];

		if (holeIndex === CRAWL_HOLE_INDEX || activeBoard[holeIndex] === 0) return;

		dispatch({ type: "SET_PROCESSING", isProcessing: true });

		let turnActive = true;
		let currentIndex = holeIndex;
		let lapsInThisTurn = 0;

		while (turnActive) {
			lapsInThisTurn++;
			dispatch({ type: "SET_TURN_LAPS", count: lapsInThisTurn });

			const { newBoard, lastIndex } = calculateMove(activeBoard, currentIndex);

			activeBoard = newBoard;
			currentIndex = lastIndex;

			dispatch({
				type: "UPDATE_BOARD",
				player: stateRef.current.currentPlayer,
				board: activeBoard,
			});

			// Sound Effect
			playSound(stateRef.current.soundEnabled);

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
	};

	const checkWinAndSwitch = async (isP1: boolean, finalBoard: number[]) => {
		const win = checkGameOver(
			isP1 ? finalBoard : stateRef.current.player1Board,
			!isP1 ? finalBoard : stateRef.current.player2Board
		);
		if (win) {
			dispatch({ type: "SET_WINNER", winner: win });
		} else {
			dispatch({ type: "SWITCH_PLAYER" });
		}
	};

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
