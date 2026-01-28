/** scripts/release-checkpoint.ts */
import { isatty } from "node:tty";
import {
	env,
	argv,
	exit,
	stdin as input,
	stdout as output,
} from "node:process";
import { createInterface } from "node:readline/promises";
import { colorize, colors } from "./utils/colors";

async function runCheckpoint() {
	const isCI = env.CI === "true";
	// Check if stdout (file descriptor 1) is a terminal
	const isInteractive = isatty(1);

	if (!isInteractive || isCI) {
		console.log(
			colorize(
				"⚠ Non-interactive or CI environment. Skipping.",
				colors.fgYellow,
			),
		);
		exit(isCI ? 0 : 1);
	}

	const rl = createInterface({ input, output });
	const promptMessage =
		argv[2] || "Are you sure you want to release a new version?";

	const formattedPrompt = `${colorize(promptMessage, colors.fgCyan)} ${colorize("(y/N) ", colors.fgYellow)}`;

	try {
		const answer = await rl.question(formattedPrompt);
		const confirmed =
			answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";

		if (confirmed) {
			console.log(
				colorize(
					"✓ Proceeding with the release...",
					colors.fgGreen + colors.bright,
				),
			);
			exit(0);
		} else {
			console.log(
				colorize("✗ Release aborted.", colors.fgMagenta + colors.bright),
			);
			exit(1);
		}
	} finally {
		rl.close();
	}
}

runCheckpoint();
