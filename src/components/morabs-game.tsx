"use client";
/** @/components/morabs-game.tsx */

import { useGameContext } from "@/hooks/use-game-context";
import { THEMES } from "@/lib/contants";
import Board from "./board";
import {
	LucideBot,
	LucideBrainCircuit,
	LucideCrown,
	LucideHash,
	LucidePalette,
	LucideRepeat,
	LucideRotateCcw,
	LucideTrophy,
	LucideUser,
	LucideVolume2,
	LucideVolumeX,
	LucideZap,
	LucideZapOff,
} from "lucide-react";

const MorabsGame = () => {
	const { winner, currentTheme } = useGameContext();
	const theme = THEMES[currentTheme];

	return (
		<main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 font-sans selection:bg-white/20">
			{/* Header */}
			<header className="text-center space-y-4 mb-8 relative w-full max-w-4xl">
				<div
					className={`inline-flex items-center justify-center p-4 rounded-full bg-white/5 mb-2`}
				>
					<LucideTrophy className={`w-8 h-8 text-${theme.primary}-500`} />
				</div>
				<GameName />
				<Records />
				<Settings />
			</header>

			{/* Game Area */}
			<div className="flex flex-col gap-8 w-full max-w-4xl items-center">
				{winner && <WinnerBanner />}
				<Boards />
				<Controls />
				<Instructions />
			</div>
		</main>
	);
};

const GameName = () => {
	const { currentTheme } = useGameContext();
	const theme = THEMES[currentTheme];

	return (
		<h1
			className={`text-5xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-b ${theme.bgGradient}`}
		>
			Morabs
		</h1>
	);
};

const Records = () => {
	const { bestRecord } = useGameContext();

	return (
		<div className="flex flex-col items-center gap-1">
			<p className="text-slate-400 font-medium">
				A Mancala Variant Strategy Game
			</p>
			{bestRecord && (
				<div className="mt-2 flex items-center gap-2 px-4 py-1.5 bg-amber-900/20 border border-amber-500/30 rounded-full text-amber-200/90 text-sm">
					<LucideCrown size={14} className="text-amber-400 fill-amber-400" />
					<span className="opacity-75">Best:</span>
					<span className="font-bold text-amber-100">
						{bestRecord.rounds} Rounds
					</span>
					<span className="opacity-50 text-xs">({bestRecord.player})</span>
				</div>
			)}
		</div>
	);
};

/** Settings Toolbar */
const Settings = () => {
	const {
		toggleSound,
		soundEnabled,
		toggleAnimations,
		useAnimations,
		cycleTheme,
	} = useGameContext();

	return (
		<div className="absolute right-0 top-0 flex flex-col gap-2">
			<button
				onClick={toggleSound}
				className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:text-white text-slate-500 transition-colors"
				title={soundEnabled ? "Mute" : "Unmute"}
			>
				{soundEnabled ? (
					<LucideVolume2 size={16} />
				) : (
					<LucideVolumeX size={16} />
				)}
			</button>
			<button
				onClick={toggleAnimations}
				className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:text-white text-slate-500 transition-colors"
				title={useAnimations ? "Disable Anim" : "Enable Anim"}
			>
				{useAnimations ? (
					<LucideZap size={16} className="fill-current" />
				) : (
					<LucideZapOff size={16} />
				)}
			</button>
			<button
				onClick={cycleTheme}
				className="p-2 rounded-full bg-slate-900 border border-slate-800 hover:text-white text-slate-500 transition-colors"
				title="Change Theme"
			>
				<LucidePalette size={16} />
			</button>
		</div>
	);
};

const WinnerBanner = () => {
	const {
		currentTheme,
		winner,
		isVsCPU,
		roundCount,
		bestRecord,
		p1MaxLaps,
		p2MaxLaps,
	} = useGameContext();
	const theme = THEMES[currentTheme];

	return (
		<div
			className={`w-full bg-${theme.primary}-500/10 border border-${theme.primary}-500/50 text-${theme.primary}-200 p-6 rounded-2xl text-center animate-in slide-in-from-top-4 fade-in duration-500 shadow-xl shadow-black/40`}
		>
			<h2 className="text-3xl font-bold flex items-center justify-center gap-3">
				<LucideTrophy /> {isVsCPU && winner === 2 ? "CPU" : `Player ${winner}`}{" "}
				Wins!
			</h2>

			<div className="mt-2 flex items-center justify-center gap-4 text-sm font-medium opacity-80">
				<span>Finished in {roundCount} Rounds</span>
				{bestRecord && roundCount <= bestRecord.rounds && (
					<span className="px-2 py-0.5 bg-white/20 rounded animate-pulse">
						New Record!
					</span>
				)}
			</div>

			<div className="mt-6 grid grid-cols-2 gap-4 max-w-xs mx-auto border-t border-white/10 pt-4">
				<div className="flex flex-col items-center">
					<span className="opacity-60 text-xs font-bold uppercase tracking-wider mb-1">
						P1 Max Laps
					</span>
					<span className="text-xl font-black">{p1MaxLaps}</span>
				</div>
				<div className="flex flex-col items-center">
					<span className="opacity-60 text-xs font-bold uppercase tracking-wider mb-1">
						{isVsCPU ? "CPU" : "P2"} Max Laps
					</span>
					<span className="text-xl font-black">{p2MaxLaps}</span>
				</div>
			</div>
		</div>
	);
};

const Boards = () => (
	<div className="flex flex-col lg:flex-row gap-8 items-center justify-center w-full">
		<Board player={1} />
		<div className="hidden lg:flex flex-col items-center gap-2 text-slate-600">
			<div className="h-12 w-px bg-slate-800" />
			<span className="text-xs font-bold uppercase tracking-widest rotate-90 whitespace-nowrap">
				VS
			</span>
			<div className="h-12 w-px bg-slate-800" />
		</div>
		<Board player={2} />
	</div>
);

const Controls = () => {
	const {
		currentTheme,
		currentPlayer,
		lastTurnStats,
		currentTurnLaps,
		roundCount,
		winner,
		cpuLevel,
		isVsCPU,
		isProcessing,
		startGame,
		toggleCPU,
		toggleCPULevel,
	} = useGameContext();
	const theme = THEMES[currentTheme];

	const showLiveStats = isProcessing;
	const statsPlayer = showLiveStats ? currentPlayer : lastTurnStats.player;
	const statsCount = showLiveStats ? currentTurnLaps : lastTurnStats.laps;

	return (
		<div className="mt-8 flex flex-col items-center gap-4">
			{/* Stats Bar */}
			<div className="flex flex-wrap items-center justify-center gap-3">
				<div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 text-sm">
					<LucideHash size={14} className={`text-${theme.primary}-500`} />
					<span>Round:</span>
					<span className={`text-${theme.primary}-400 font-bold text-base`}>
						{roundCount}
					</span>
				</div>
				<div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 text-sm">
					<LucideRepeat
						size={14}
						className={
							showLiveStats
								? "text-amber-500 animate-spin-slow"
								: "text-slate-500"
						}
					/>
					<span>
						{showLiveStats
							? "Current Go-Arounds"
							: `${
									statsPlayer === 2 && isVsCPU ? "CPU" : `Player ${statsPlayer}`
							  } Go-Arounds`}
						:
					</span>
					<span
						className={`font-bold text-base ${
							showLiveStats ? "text-amber-400" : "text-slate-300"
						}`}
					>
						{statsCount}
					</span>
				</div>
				<div className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 text-sm">
					{isVsCPU && currentPlayer === 2 ? (
						<LucideBot size={14} className={`text-${theme.primary}-500`} />
					) : (
						<LucideUser size={14} className={`text-${theme.primary}-500`} />
					)}
					<span>Turn:</span>
					<span className={`text-${theme.primary}-400 font-bold`}>
						{isVsCPU && currentPlayer === 2 ? "CPU" : `Player ${currentPlayer}`}
					</span>
				</div>
			</div>

			<div className="flex flex-wrap justify-center gap-3">
				<button
					onClick={toggleCPU}
					disabled={roundCount > 1 || currentPlayer !== 1 || winner !== null}
					className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 border ${
						isVsCPU
							? `bg-${theme.primary}-500/20 border-${theme.primary}-500 text-${theme.primary}-200`
							: "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800"
					}`}
				>
					<LucideBot size={18} /> {isVsCPU ? "Mode: vs CPU" : "Mode: 2 Player"}
				</button>

				{isVsCPU && (
					<button
						onClick={toggleCPULevel}
						disabled={roundCount > 1 || currentPlayer !== 1 || winner !== null}
						className="flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm transition-all duration-300 border bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
					>
						<LucideBrainCircuit
							size={18}
							className={cpuLevel === 2 ? "text-rose-400" : ""}
						/>
						{cpuLevel === 1 ? "Lvl 1: Simple" : "Lvl 2: Smart"}
					</button>
				)}

				<button
					onClick={startGame}
					className={`
                                group flex items-center gap-2 px-8 py-3 rounded-full font-bold text-lg
                                transition-all duration-300
                                ${
																	winner
																		? `bg-${theme.primary}-500 hover:bg-${theme.primary}-400 text-slate-950 shadow-lg shadow-${theme.primary}-500/20 hover:-translate-y-1`
																		: "bg-slate-800 text-slate-300 hover:bg-slate-700"
																}
                            `}
				>
					<LucideRotateCcw
						className={`w-5 h-5 ${
							winner
								? "animate-spin-slow"
								: "group-hover:-rotate-180 transition-transform duration-500"
						}`}
					/>
					{winner ? "Play Again" : "Reset Game"}
				</button>
			</div>
		</div>
	);
};

const Instructions = () => {
	const { currentTheme } = useGameContext();
	const theme = THEMES[currentTheme];

	return (
		<div className="mt-12 max-w-lg text-center text-slate-500 text-sm leading-relaxed">
			<p>
				Pick a hole to sow stones. If the last stone lands in an occupied hole,
				you pick those up and continue. If it lands in an empty hole or your
				<span className={`text-${theme.primary}-500 font-bold mx-1`}>
					Crawl-Hole
				</span>
				, your turn ends.
			</p>
		</div>
	);
};

export default MorabsGame;
