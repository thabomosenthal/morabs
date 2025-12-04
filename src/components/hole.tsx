"use client";

import React from "react";

import { useGameContext } from "@/hooks/use-game-context";
import { THEMES } from "@/lib/contants";
import { usePrevious } from "@/hooks/use-previous";

interface HoleProps {
	index: number;
	stones: number;
	isDisabled?: boolean;
	isCrawlHole?: boolean; // New prop to indicate crawl-hole
	onClick: (holeIndex:number) => void;
}

const Hole: React.FC<HoleProps> = ({
	index,
	stones,
	isDisabled,
	isCrawlHole,
	onClick,
}) => {
	const { useAnimations, currentTheme } = useGameContext();
	const theme = THEMES[currentTheme];

	const prevStones = usePrevious(stones);
	const [animClass, setAnimClass] = React.useState("");

	const visualCount = Math.min(stones, 15);
	const stoneVisuals = Array.from({ length: visualCount });

	React.useEffect(() => {
		if (!useAnimations || !prevStones || prevStones === stones) return;

		if (stones > prevStones) setAnimClass(`scale-110 ${theme.stonePop}`);
		else if (stones < prevStones)
			setAnimClass(`scale-95 brightness-125 ring-2 ring-white/50`);

		const timer = setTimeout(() => setAnimClass(""), 400);
		return () => clearTimeout(timer);
	}, [stones, prevStones, useAnimations, theme]);

	return (
		<div className="flex flex-col items-center gap-2">
			<button
				onClick={() => !isDisabled && !isCrawlHole && onClick(index)}
				disabled={isDisabled || isCrawlHole || stones === 0}
				className={`
            relative flex items-center justify-center 
            transition-all duration-300 ease-out
            ${animClass}
            ${
							isCrawlHole
								? `w-24 h-24 rounded-2xl ${theme.boardBg} border-4 border-white/10`
								: `w-16 h-16 rounded-full ${theme.boardBg} border-2 border-white/10`
						}
            ${
							!isDisabled && !isCrawlHole && stones > 0
								? "hover:border-white/40 hover:bg-white/10 cursor-pointer active:scale-95 shadow-lg shadow-black/20"
								: "opacity-70 cursor-not-allowed"
						}
        `}
			>
				<div className="flex flex-wrap items-center justify-center gap-1 p-2 w-full h-full overflow-hidden content-center">
					{stoneVisuals.map((_, i) => (
						<div
							key={i}
							className={`rounded-full shadow-sm transition-all duration-500 ${isCrawlHole ? `w-3 h-3 ${theme.crawlHole}` : `w-2.5 h-2.5 ${theme.stoneColor}`}`}
						/>
					))}
					{stones > 15 && (
						<span className="text-xs font-bold text-white/80 animate-in fade-in">
							+{stones - 15}
						</span>
					)}
				</div>
				<div
					className={`absolute -top-2 -right-2 bg-slate-900 text-slate-200 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border border-slate-700 shadow-md transition-transform duration-300 ${animClass ? "scale-125" : ""}`}
				>
					{stones}
				</div>
			</button>
			<span className="text-xs font-mono text-slate-500 uppercase">
				{isCrawlHole ? "HOME" : `H${index + 1}`}
			</span>
		</div>
	);
};

export default Hole;
