/** @format */

"use client";

import React from "react";
import { useMorabsStore } from "@/store/morabs-store";
interface HoleProps {
	index: number;
	stones: number;
	isDisabled?: boolean;
	isCrawlHole?: boolean; // New prop to indicate crawl-hole
}

const Hole: React.FC<HoleProps> = ({
	index,
	stones,
	isDisabled,
	isCrawlHole,
}) => {
	const makeMove = useMorabsStore((state) => state.makeMove);

	const handleClick = () => {
		if (isCrawlHole) {
			// Optionally display a message or prevent the click
			alert("You cannot pick stones from the crawl-hole!");
			return;
		}
		makeMove(index);
	};

	return (
		<div
			style={{
				cursor: isDisabled || isCrawlHole ? "not-allowed" : "pointer", // Disable cursor
				opacity: isDisabled || isCrawlHole ? 0.5 : 1, // Visually indicate disabled state
				backgroundColor: isCrawlHole ? "lightgreen" : "white", // Highlight crawl-hole
			}}
			className="size-12 border border-zinc-500 text-zinc-900 font-bold rounded-full flex justify-center items-center m-1.5"
			onClick={isDisabled || isCrawlHole ? undefined : handleClick} // Use handleClick
		>
			{stones}
		</div>
	);
};

export default Hole;
