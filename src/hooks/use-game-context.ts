import { GameContext } from "@/components/game-provider";
import React from "react";

export const useGameContext = () => {
	const context = React.use(GameContext);

	if (!context) {
		throw new Error(
			"useGameContext must be used within a GameContext Provider"
		);
	}

	return context;
};
