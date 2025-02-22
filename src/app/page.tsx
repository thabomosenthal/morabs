/** @format */
"use client";

import React from "react";
import Board from "@/components/board";
import { useMorabsStore } from "@/store/morabs-store";

const Home = () => {
	const currentPlayer = useMorabsStore((state) => state.currentPlayer);
	const winner = useMorabsStore((state) => state.winner);
	const startGame = useMorabsStore((state) => state.startGame);

	return (
		<div>
			<h1>Morabs Game</h1>
			<p>
				Current Player: {winner ? `Winner is Player ${winner}!` : currentPlayer}
			</p>
			<Board />
			<button onClick={startGame}>Start New Game</button>
		</div>
	);
};

export default Home;
