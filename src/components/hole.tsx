/** @format */

"use client";

import { useMorabsStore } from "@/store/morabs-store";
import React from "react";

interface HoleProps {
	index: number;
	stones: number;
}

const Hole: React.FC<HoleProps> = ({ index, stones }) => {
	const makeMove = useMorabsStore((state) => state.makeMove);

	return (
		<div
			style={{
				width: "50px",
				height: "50px",
				border: "1px solid black",
				margin: "5px",
				textAlign: "center",
				cursor: "pointer",
			}}
			onClick={() => makeMove(index)}
		>
			{stones}
		</div>
	);
};

export default Hole;
