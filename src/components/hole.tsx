/** @format */

"use client";

import React from "react";
import { useMorabsStore } from "@/store/morabs-store";
import { cn } from "@/utils/classes-merge";
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
		<button
			style={{
				opacity: isDisabled || isCrawlHole ? 0.5 : 1, // Visually indicate disabled state
			}}
			className={cn(
				"border-2 border-zinc-600",
				"hover:-translate-y-1 disabled:translate-none",
				"flex justify-center items-center",
				"size-12   font-bold rounded-full  m-1.5",
				"focus-visible:right-1 focus-visible:ring-amber-800",
				"cursor-pointer disabled:cursor-not-allowed",
				"disabled:opacity-50",
				isCrawlHole
					? "bg-green-700 border-green-900 text-green-200 hover:translate-none cursor-not-allowed"
					: "bg-zinc-200 text-zinc-900"
			)}
			disabled={isDisabled}
			onClick={isDisabled || isCrawlHole ? undefined : handleClick} // Use handleClick
		>
			{stones}
		</button>
	);
};

export default Hole;
