/** scripts/release-manager.ts */

import * as readline from "readline";
import * as process from "process";
import { colors, colorize } from "./utils/colors"; // Adjust path if you put it directly in 'scripts/'

// Check if we are in an interactive environment or if a "force" flag is present
const isInteractive = process.stdout.isTTY;
const isCI = process.env.CI === "true";

// If we are in CI or not interactive, we usually want to skip the prompt.
// However, decide if you want to AUTO-APPROVE or AUTO-FAIL in CI.
// Usually, you want to fail/skip in CI to prevent accidental automated releases,
// unless you have a specific flag.
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

// Get the prompt message from the command line arguments,
// or use a default if no argument is provided.
// process.argv[0] is 'node' or 'tsx', process.argv[1] is the script path
const customPrompt = process.argv[2];
const defaultPrompt = "Are you sure you want to release a new version?";
const promptMessage = customPrompt || defaultPrompt;

// Use a distinct color for the prompt, like Cyan, with Yellow for (y/N)
// const formattedPrompt = `${colors.fgCyan}${promptMessage} ${colors.fgYellow}(y/N)${colors.reset} `;
const formattedPrompt =
	colorize(promptMessage, colors.fgCyan) +
	" " +
	colorize("(y/N) ", colors.fgYellow);

rl.question(formattedPrompt, (answer) => {
	rl.close();
	if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
		// Green for success
		// console.log(`${colors.fgGreen}${colors.bright}✓ Proceeding with the release...${colors.reset}`);
		console.log(
			colorize(
				"✓ Proceeding with the release...",
				colors.fgGreen + colors.bright
			)
		);
		process.exit(0);
	} else {
		// Magenta for user-aborted. It's a "softer" red, often appearing purple or pink.
		// console.log(`${colors.fgMagenta}${colors.bright}✗ Release aborted.${colors.reset}`);
		console.log(
			colorize("✗ Release aborted.", colors.fgMagenta + colors.bright)
		);
		process.exit(1);
	}
});
