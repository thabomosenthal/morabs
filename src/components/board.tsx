// components/Board.tsx
import React from "react";
import { useMorabsStore } from "@/store/morabs-store";
import Hole from "./hole";

const Board = () => {
  const board = useMorabsStore((state) => state.board);

  return (
    <div style={{ display: "flex" }}>
      {board.map((stones, index) => (
        <Hole key={index} index={index} stones={stones} />
      ))}
    </div>
  );
};

export default Board;
