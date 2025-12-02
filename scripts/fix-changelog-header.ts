import * as fs from "fs";
import * as path from "path";
import * as process from "process";

const changelogPath = path.resolve(process.cwd(), "CHANGELOG.md");

const ignoreRule = "";
const requiredHeader = "# Changelog";

const fullHeaderBlock = `${ignoreRule}\n${requiredHeader}\n\n`;

try {
	let content = fs.readFileSync(changelogPath, "utf8");

	// 1. Remove the old, possibly separate, header elements if they exist (Existing logic)
	content = content.replace(new RegExp(`^${ignoreRule}\\n?`, "gm"), "");
	content = content.replace(new RegExp(`^${requiredHeader}\\n?`, "gm"), "");

	// 2. Remove multiple empty rows (NEW LOGIC)
	// This replaces 3 or more consecutive newlines (including carriage returns \r) with two newlines (\n\n),
	// ensuring no excessive blank space while preserving markdown paragraph breaks.
	content = content.replace(/(\r?\n){3,}/g, "\n\n");

	// 3. Clean any leading whitespace/newlines before prepending
	content = content.trimStart();

	// 4. Prepend the complete, structured header block (Existing logic)
	content = fullHeaderBlock + content;

	// 5. Write back the corrected content
	fs.writeFileSync(changelogPath, content, "utf8");

	console.log("✅ Changelog cleaned, header corrected, and MD024 disabled.");
	process.exit(0);
} catch (error) {
	console.error("❌ Failed to clean and fix CHANGELOG.md header:", error);
	process.exit(1);
}
