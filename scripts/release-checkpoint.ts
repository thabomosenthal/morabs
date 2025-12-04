/** scripts/release-checkpoint.ts */

import * as readline from "readline";
import * as process from "process";
import { colors, colorize } from "./utils/colors";

// Check if we are in an interactive environment or if a "force" flag is present
const isInteractive = process.stdout.isTTY;
const isCI = process.env.CI === "true";

// If we are not interactive, we want to skip the prompt to prevent accidental automated releases
if (!isInteractive || isCI) {
	console.log(
		colorize(
			"⚠ Non-interactive environment detected. Skipping confirmation prompt.",
			colors.fgYellow
		)
	);
	// Option A: Proceed automatically (risky)
	// process.exit(0);

	// Option B: Abort (safer, requires manual release)
	console.log(
		colorize("✗ Cannot release in non-interactive mode.", colors.fgRed)
	);
	process.exit(1);
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const customPrompt = process.argv[2];
const defaultPrompt = "Are you sure you want to release a new version?";
const promptMessage = customPrompt || defaultPrompt;

const formattedPrompt =
	colorize(promptMessage, colors.fgCyan) +
	" " +
	colorize("(y/N) ", colors.fgYellow);

rl.question(formattedPrompt, (answer) => {
	rl.close();
	if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
		console.log(
			colorize(
				"✓ Proceeding with the release...",
				colors.fgGreen + colors.bright
			)
		);
		process.exit(0);
	} else {
		console.log(
			colorize("✗ Release aborted.", colors.fgMagenta + colors.bright)
		);
		process.exit(1);
	}
});
