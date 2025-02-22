/** @format */

// store/morabsStore.ts
import { create } from "zustand";

// Define the game state type
interface MorabsState {
	board: number[];
	currentPlayer: 1 | 2;
	winner: 1 | 2 | null;
	startGame: () => void;
	makeMove: (holeIndex: number) => void;
	isGameOver: (boardToCheck: number[]) => boolean;
	switchPlayer: () => void;
}

const initialBoard = [4, 4, 4, 4, 4, 4, 4, 4, 4, 0]; // 9 holes with 4 stones, 1 crawl-hole
const initialPlayer: 1 | 2 = 1;

// Create the Zustand store
export const useMorabsStore = create<MorabsState>((set, get) => ({
	board: initialBoard,
	currentPlayer: initialPlayer,
	winner: null,

	startGame: () => {
		set({ board: initialBoard, currentPlayer: initialPlayer, winner: null });
	},

	makeMove: (holeIndex: number) => {
		if (get().winner) return; // Game over

		const newBoard = [...get().board];
		let stones = newBoard[holeIndex];
		newBoard[holeIndex] = 0; // Pick up stones

		let currentIndex = holeIndex;
		while (stones > 0) {
			currentIndex = (currentIndex + 1) % newBoard.length; // Circular
			newBoard[currentIndex]++;
			stones--;
		}

		set({ board: newBoard });

		if (newBoard[currentIndex] === 1 && currentIndex !== 9) {
			// Empty hole (not crawl-hole)
			get().switchPlayer();
		} else if (currentIndex === 9) {
			// Ended on crawl-hole
			get().switchPlayer();
		} else {
			// Continue turn (ended on non-empty hole)
			get().makeMove(currentIndex); // Recursive call
		}

		if (get().isGameOver(newBoard)) {
			set({ winner: get().currentPlayer });
		}
	},

	isGameOver: (boardToCheck: number[]) => {
		let sum = 0;
		for (let i = 0; i < boardToCheck.length - 1; i++) {
			sum += boardToCheck[i];
		}
		return sum === 0;
	},

	switchPlayer: () => {
		set({ currentPlayer: get().currentPlayer === 1 ? 2 : 1 });
	},
}));
