import * as fs from "fs";
import * as path from "path";
import * as process from "process";

const changelogPath = path.resolve(process.cwd(), "CHANGELOG.md");
// Define the exact H1 header your linter requires
const requiredHeader = "# Changelog";
const requiredFullLine = requiredHeader + "\n";

try {
	let content = fs.readFileSync(changelogPath, "utf8");

	// 1. Clean any potential leading newlines/whitespace added by the generator
	content = content.trimStart();

	// 2. Check if the required header is already present
	if (!content.startsWith(requiredHeader)) {
		// 3. If not, prepend the required header to satisfy MD041
		// We assume the generator has already prepended the new release block.
		// The structure will become: # Changelog \n\n ## [version]...
		content = requiredFullLine + "\n" + content;
	}

	// 4. Write back the corrected content
	fs.writeFileSync(changelogPath, content, "utf8");

	console.log("✅ Changelog header corrected for MD041 rule.");
	process.exit(0);
} catch (error) {
	console.error("❌ Failed to fix CHANGELOG.md header:", error);
	process.exit(1);
}
