/** @/hooks/use-game-context.ts */

import React from "react";
import { GameContext } from "@/components/game-provider";

export const useGameContext = () => {
  const context = React.use(GameContext);

  if (!context) {
    throw new Error(
      "useGameContext must be used within a GameContext Provider",
    );
  }

  return context;
};
