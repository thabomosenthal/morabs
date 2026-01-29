/** scripts/release-checkpoint.ts */

import { readFile } from "node:fs/promises";
import {
  argv,
  env,
  exit,
  stdin as input,
  stdout as output,
} from "node:process";
import { createInterface } from "node:readline/promises";
import { isatty } from "node:tty";
import { colorize, colors } from "./utils/colors";

async function runCheckpoint() {
  const isCI = env.CI === "true";
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

  try {
    // Read current version to show the user what is about to change
    const pkgContent = await readFile("./package.json", "utf-8");
    const pkg = JSON.parse(pkgContent);

    console.log(
      colorize(
        `\n⚡ Current Version: v${pkg.version}`,
        colors.fgWhite + colors.bright,
      ),
    );
    console.log(
      colorize("Preparing to calculate new version jump...", colors.fgCyan),
    );

    const promptMessage =
      argv[2] || "Are you sure you want to release a new version?";
    const formattedPrompt = `${colorize(promptMessage, colors.fgCyan)} ${colorize("(y/N) ", colors.fgYellow)}`;

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
  } catch (error) {
    console.error(
      colorize(`✗ Error reading project metadata: ${error}`, colors.fgRed),
    );
    exit(1);
  } finally {
    rl.close();
  }
}

runCheckpoint();
