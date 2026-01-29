/** scripts/fix-changelog-header.ts */
import { readFile, writeFile } from "node:fs/promises";
import { colorize, colors } from "./utils/colors";

async function fixChangelogHeader() {
  const changelogPath = "./CHANGELOG.md";

  try {
    const data = await readFile(changelogPath, "utf8");

    // Fix headers and disable MD024 (Duplicate headers) for changelogs
    const result = data
      .replace(/# Changelog/g, "# Changelog\n\n\n\n")
      .replace(/## \[/g, "## ");

    await writeFile(changelogPath, result, "utf8");

    console.log(
      colorize(
        "✅ Changelog cleaned, header corrected, and MD024 disabled.",
        colors.fgGreen + colors.bright,
      ),
    );
  } catch (error) {
    console.error(
      colorize(`✗ Failed to fix Changelog: ${error}`, colors.fgRed),
    );
    process.exit(1);
  }
}

fixChangelogHeader();
