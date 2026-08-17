import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

interface WorkspacePackageJson {
	scripts?: Record<string, string>;
}

const packageJson = JSON.parse(
	readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as WorkspacePackageJson;

describe("component workspace build graph", () => {
	it("keeps the recursive package build out of the root Turbo build graph", () => {
		expect(packageJson.scripts?.build).toBeUndefined();
		expect(packageJson.scripts?.["build:packages"]).toBe(
			'pnpm -r --filter "./src/*" build',
		);
	});
});
