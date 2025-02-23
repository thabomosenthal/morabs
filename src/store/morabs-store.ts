/** @format */

// store/morabsStore.ts
import { create } from "zustand";

// Define the game state type
interface MorabsState {
	player1Board: number[];
	player2Board: number[];
	currentPlayer: 1 | 2;
	winner: 1 | 2 | null;
	startGame: () => void;
	makeMove: (holeIndex: number) => void;
	isGameOver: () => boolean; // No longer needs boardToCheck
	switchPlayer: () => void;
}

const initialBoard = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0]; // 11 holes with 5 stones, 1 crawl-hole
const initialPlayer: 1 | 2 = 1;

const crawlHoleIndex = initialBoard.length - 1;

// Create the Zustand store
export const useMorabsStore = create<MorabsState>((set, get) => ({
	player1Board: initialBoard,
	player2Board: [...initialBoard], // Create a separate copy
	currentPlayer: initialPlayer,
	winner: null,

	startGame: () => {
		set({
			player1Board: initialBoard,
			player2Board: [...initialBoard],
			currentPlayer: initialPlayer,
			winner: null,
		});
	},

	makeMove: (holeIndex: number) => {
		if (get().winner) return; // Game over

		// Prevent picking from the crawl-hole
		if (holeIndex === crawlHoleIndex) {
			return; // Do nothing if the crawl-hole is selected
		}

		const currentPlayer = get().currentPlayer;
		const currentBoard =
			currentPlayer === 1 ? [...get().player1Board] : [...get().player2Board];

		// Prevent picking from an empty hole
		if (currentBoard[holeIndex] === 0) {
			return; // Do nothing if the selected hole is empty
		}

		let stones = currentBoard[holeIndex];
		currentBoard[holeIndex] = 0; // Pick up stones

		let currentIndex = holeIndex;
		while (stones > 0) {
			currentIndex = (currentIndex + 1) % currentBoard.length; // Circular
			currentBoard[currentIndex]++;
			stones--;
		}

		// Update the board based on the current player
		if (currentPlayer === 1) {
			set({ player1Board: currentBoard });
		} else {
			set({ player2Board: currentBoard });
		}

		if (currentBoard[currentIndex] === 1 && currentIndex !== crawlHoleIndex) {
			// Empty hole (not crawl-hole)
			get().switchPlayer();
		} else if (currentIndex === crawlHoleIndex) {
			// Ended on crawl-hole
			get().switchPlayer();
		} else {
			// Continue turn (ended on non-empty hole)
			get().makeMove(currentIndex); // Recursive call
		}

		// Check for win condition after each move
		if (get().isGameOver()) {
			// The winner is the current player
			set({ winner: currentPlayer });
		}
	},

	isGameOver: () => {
		const player1Board = get().player1Board;
		const player2Board = get().player2Board;

		const player1Sum = player1Board.reduce((sum, stones, index) => {
			if (index !== crawlHoleIndex) {
				return sum + stones;
			}
			return sum;
		}, 0);

		const player2Sum = player2Board.reduce((sum, stones, index) => {
			if (index !== crawlHoleIndex) {
				return sum + stones;
			}
			return sum;
		}, 0);

		// Check if either player has all stones in their crawl-hole
		if (player1Sum === 0 && player1Board[crawlHoleIndex!] > 0) {
			return true; // Player 1 wins
		}

		if (player2Sum === 0 && player2Board[crawlHoleIndex!] > 0) {
			return true; // Player 2 wins
		}

		return false; // No winner yet
	},

	switchPlayer: () => {
		set({ currentPlayer: get().currentPlayer === 1 ? 2 : 1 });
	},
}));
