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
		<main className="container grid place-items-center gap-8 mt-18">
			<section className="grid gap-2 place-items-center">
				<h1 className="text-4xl font-extrabold">Morabs Game</h1>
				<p className="font-bold">Current Player: {currentPlayer}</p>
				{winner && (
					<p className="text-emerald-500 text-lg font-bold">
						Winner: Player {winner}!
					</p>
				)}
			</section>
			<Board player={1} />
			<Board player={2} />
			<button
				onClick={startGame}
				className="border bg-white/10 font-bold py-2 px-6 rounded-full disabled:opacity-25 cursor-pointer disabled:cursor-not-allowed hover:-translate-y-0.5 active:scale-95"
				disabled={!winner}
			>
				Start Game
			</button>
		</main>
	);
};

export default Home;
