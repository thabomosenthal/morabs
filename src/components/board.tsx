/** @format */

"use client";

import React from "react";
import { useMorabsStore } from "@/store/morabs-store";
import Hole from "./hole";
import { cn } from "@/utils/classes-merge";

interface BoardProps {
	player: 1 | 2;
}

const Board: React.FC<BoardProps> = ({ player }) => {
	const player1Board = useMorabsStore((state) => state.player1Board);
	const player2Board = useMorabsStore((state) => state.player2Board);
	const currentPlayer = useMorabsStore((state) => state.currentPlayer);

	const board = player === 1 ? player1Board : player2Board;

	// Disable the board if it's not the current player's turn
	const isDisabled = player !== currentPlayer;

	return (
		<div>
			<h3 className={cn(isDisabled && "opacity-20")}>
				Player {player}'s Board
			</h3>
			<div style={{ display: "flex" }}>
				{board.map((stones, index) => (
					<Hole
						key={index}
						index={index}
						stones={stones}
						isDisabled={isDisabled}
						isCrawlHole={index === board.length - 1} // Pass isCrawlHole prop
					/>
				))}
			</div>
		</div>
	);
};

export default Board;
