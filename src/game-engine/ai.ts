/** @/game-engine/ai.ts */

import { CRAWL_HOLE_INDEX, TOTAL_STONES } from "@/lib/contants";
import { calculateMove } from "./rules";

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

export { getBestAIMove, simulateTurnStats };
