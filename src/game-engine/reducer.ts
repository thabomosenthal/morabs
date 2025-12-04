/** @/game-engine/reducer.ts */

import { GameAction, GameState, GameTheme } from "@/lib/types";
import { INITIAL_BOARD } from "./rules";
import { THEMES } from "@/lib/contants";

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

export { gameReducer, initialState };
