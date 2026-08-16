/**
 * PLAN-0036 P1-02 — M3 field-derivation codegen + `check:fields-drift` gate.
 *
 * Three obligations from the plan's acceptance criteria:
 *   1. goldens committed — the live tree is drift-free right now;
 *   2. extraction is correct — values match DOC-01 §5 exactly;
 *   3. **drift injected in a test fails it** — the gate actually bites.
 *
 * (3) drives the real `deriveFields` gate against a temp fixture tree with a
 * mutated `@anvilkit/ui` source, so the test exercises the shipped code path
 * rather than a re-implementation of it.
 */
import {
	cpSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
// @ts-expect-error -- plain-JS gate module, intentionally untyped (see its header)
import { deriveFields } from "../scripts/field-derivation.mjs";

const WORKSPACE_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const UI_SRC_DIR = join(WORKSPACE_DIR, "..", "..", "runtime", "ui", "src");
const MANIFEST_PATH = join(
	WORKSPACE_DIR,
	"scripts",
	"shadcn-field-targets.json",
);

type DeriveResult = {
	written: string[];
	unchanged: string[];
	drifted: { file: string; reason: string }[];
	skipped: string[];
	errors: string[];
};

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));

const tempRoots: string[] = [];
afterAll(() => {
	for (const root of tempRoots) rmSync(root, { recursive: true, force: true });
});

/**
 * A throwaway tree holding a copy of the vendored ui sources plus stub
 * package dirs, so a mutation can never touch the real checkout.
 */
function makeFixture(packages: string[]) {
	const root = mkdtempSync(join(tmpdir(), "anvilkit-fields-drift-"));
	tempRoots.push(root);
	const uiSrcDir = join(root, "ui-src");
	const workspaceDir = join(root, "workspace");
	cpSync(UI_SRC_DIR, uiSrcDir, { recursive: true });
	for (const name of packages)
		mkdirSync(join(workspaceDir, "src", name), { recursive: true });
	return { uiSrcDir, workspaceDir };
}

describe("check:fields-drift", () => {
	it("reports zero drift against the committed goldens", () => {
		const result: DeriveResult = deriveFields({
			manifest,
			uiSrcDir: UI_SRC_DIR,
			workspaceDir: WORKSPACE_DIR,
			check: true,
		});

		expect(result.errors).toEqual([]);
		expect(result.drifted).toEqual([]);
		expect(result.written).toEqual([]);
		expect(result.unchanged.length).toBeGreaterThan(0);
	});

	it("names every not-yet-scaffolded package instead of silently skipping it", () => {
		const result: DeriveResult = deriveFields({
			manifest,
			uiSrcDir: UI_SRC_DIR,
			workspaceDir: WORKSPACE_DIR,
			check: true,
		});

		const covered = result.unchanged.length + result.skipped.length;
		expect(covered).toBe(manifest.targets.length);
		for (const entry of result.skipped) {
			expect(entry).toMatch(/package not scaffolded yet/);
		}
	});

	it("FAILS when an upstream cva axis gains a value", () => {
		const { uiSrcDir, workspaceDir } = makeFixture(["badge"]);
		// Prime the goldens from the pristine copy…
		const primed: DeriveResult = deriveFields({
			manifest,
			uiSrcDir,
			workspaceDir,
		});
		expect(primed.errors).toEqual([]);
		expect(primed.written).toContain(
			join("src", "badge", "src", "generated", "fields.gen.ts"),
		);

		// …then inject the drift a shadcn bump would produce.
		const badgePath = join(uiSrcDir, "badge.tsx");
		writeFileSync(
			badgePath,
			readFileSync(badgePath, "utf8").replace(
				'link: "text-primary underline-offset-4 hover:underline",',
				'link: "text-primary underline-offset-4 hover:underline",\n        warning: "bg-warning text-warning-foreground",',
			),
		);

		const result: DeriveResult = deriveFields({
			manifest,
			uiSrcDir,
			workspaceDir,
			check: true,
		});

		expect(result.drifted.map((entry) => entry.file)).toContain(
			join("src", "badge", "src", "generated", "fields.gen.ts"),
		);
		expect(result.drifted[0]?.reason).toBe(
			"golden differs from upstream source",
		);
	});

	it("FAILS when an upstream literal-union prop loses a value", () => {
		const { uiSrcDir, workspaceDir } = makeFixture(["card"]);
		deriveFields({ manifest, uiSrcDir, workspaceDir });

		const cardPath = join(uiSrcDir, "card.tsx");
		writeFileSync(
			cardPath,
			readFileSync(cardPath, "utf8").replace(
				'size?: "default" | "sm"',
				'size?: "default"',
			),
		);

		const result: DeriveResult = deriveFields({
			manifest,
			uiSrcDir,
			workspaceDir,
			check: true,
		});

		expect(result.drifted.map((entry) => entry.file)).toContain(
			join("src", "card", "src", "generated", "fields.gen.ts"),
		);
	});

	it("FAILS LOUDLY when an upstream axis is renamed away", () => {
		const { uiSrcDir, workspaceDir } = makeFixture(["badge"]);
		const badgePath = join(uiSrcDir, "badge.tsx");
		writeFileSync(
			badgePath,
			readFileSync(badgePath, "utf8").replace(
				"const badgeVariants = cva(",
				"const badgeStyles = cva(",
			),
		);

		const result: DeriveResult = deriveFields({
			manifest,
			uiSrcDir,
			workspaceDir,
			check: true,
		});

		expect(result.errors.join("\n")).toMatch(
			/no `const badgeVariants = …` call found/,
		);
	});

	it("FAILS when a curation targets a value that no longer exists upstream", () => {
		const { uiSrcDir, workspaceDir } = makeFixture(["button"]);
		const buttonPath = join(uiSrcDir, "button.tsx");
		writeFileSync(
			buttonPath,
			readFileSync(buttonPath, "utf8").replace('"icon-lg": "size-9",', ""),
		);

		const result: DeriveResult = deriveFields({
			manifest,
			uiSrcDir,
			workspaceDir,
			check: true,
		});

		expect(result.errors.join("\n")).toMatch(
			/value\(s\) absent upstream: icon-lg/,
		);
	});
});

describe("derived unions match DOC-01 §5", () => {
	// The goldens are the contract; assert their exact contents so a
	// regenerate that silently reorders or drops a value is caught here too.
	const golden = (pkg: string) =>
		readFileSync(
			join(WORKSPACE_DIR, "src", pkg, "src", "generated", "fields.gen.ts"),
			"utf8",
		);

	it("button — 6 variants, 8 source sizes curated to 4 (§5.1)", () => {
		const source = golden("button");
		expect(source).toContain(
			'export const variantSourceValues = [\n\t"default",\n\t"outline",\n\t"secondary",\n\t"ghost",\n\t"destructive",\n\t"link",\n] as const;',
		);
		expect(source).toContain(
			'export const sizeOptions = ["default", "xs", "sm", "lg"] as const;',
		);
		for (const excluded of ["icon", "icon-xs", "icon-sm", "icon-lg"]) {
			expect(source).toContain(`"${excluded}",`);
		}
	});

	it("badge — exact 6-value cva union (§5.2)", () => {
		expect(golden("badge")).toContain(
			'export const variantOptions = [\n\t"default",\n\t"secondary",\n\t"destructive",\n\t"outline",\n\t"ghost",\n\t"link",\n] as const;',
		);
	});

	it("card — size prop-union default|sm (§5.3)", () => {
		expect(golden("card")).toContain(
			'export const sizeOptions = ["default", "sm"] as const;',
		);
	});

	it("select — triggerSize maps the SelectTrigger `size` prop (§5.5)", () => {
		const source = golden("select");
		expect(source).toContain(
			'export const triggerSizeOptions = ["sm", "default"] as const;',
		);
		expect(source).toContain("export type TriggerSize =");
	});
});
