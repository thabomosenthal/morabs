/** @/game-engine/rules.ts */

import { CRAWL_HOLE_INDEX } from "@/lib/contants";

const INITIAL_BOARD = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0]; // 10 holes + 1 crawl-hole

const calculateMove = (board: number[], startIndex: number) => {
  const currentBoard = [...board];
  let hand = currentBoard[startIndex];
  currentBoard[startIndex] = 0;

  let currIndex = startIndex;
  while (hand > 0) {
    currIndex = (currIndex + 1) % currentBoard.length;
    currentBoard[currIndex]++;
    hand--;
  }
  return { newBoard: currentBoard, lastIndex: currIndex };
};

const checkGameOver = (p1Board: number[], p2Board: number[]) => {
  const p1Sum = p1Board.reduce(
    (acc, val, idx) => (idx !== CRAWL_HOLE_INDEX ? acc + val : acc),
    0,
  );
  const p2Sum = p2Board.reduce(
    (acc, val, idx) => (idx !== CRAWL_HOLE_INDEX ? acc + val : acc),
    0,
  );

  if (p1Sum === 0 && p1Board[CRAWL_HOLE_INDEX] > 0) return 1;
  if (p2Sum === 0 && p2Board[CRAWL_HOLE_INDEX] > 0) return 2;
  return null;
};

export { calculateMove, checkGameOver, INITIAL_BOARD };
