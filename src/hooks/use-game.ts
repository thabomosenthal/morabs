import { GameContext } from "@/components/game-provider";
import React from "react";

export const useGame = () => {
	const context = React.use(GameContext);

	if (!context) {
		throw new Error("useGame must be used within a GameContext Provider");
	}

	return context;
};
