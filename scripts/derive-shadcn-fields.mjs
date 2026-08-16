#!/usr/bin/env node
/**
 * PLAN-0036 P1-02 (M3) — shadcn field-derivation codegen + drift gate (CLI).
 *
 * Thin wrapper over `scripts/field-derivation.mjs`; that module owns the
 * extraction, curation, and golden-rendering rules and is what
 * `tests/fields-drift.test.ts` drives with injected fixtures.
 *
 * Usage:
 *   node scripts/derive-shadcn-fields.mjs           write goldens  (pnpm gen:fields)
 *   node scripts/derive-shadcn-fields.mjs --check   drift gate     (pnpm check:fields-drift)
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deriveFields } from "./field-derivation.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const WORKSPACE_DIR = join(SCRIPT_DIR, "..");
const UI_SRC_DIR = join(SCRIPT_DIR, "..", "..", "..", "runtime", "ui", "src");
const MANIFEST_PATH = join(SCRIPT_DIR, "shadcn-field-targets.json");
const check = process.argv.includes("--check");

const { written, unchanged, drifted, skipped, errors } = deriveFields({
	manifest: JSON.parse(readFileSync(MANIFEST_PATH, "utf8")),
	uiSrcDir: UI_SRC_DIR,
	workspaceDir: WORKSPACE_DIR,
	check,
});

for (const message of skipped) console.log(`  SKIP  ${message}`);
for (const file of unchanged) console.log(`  ok    ${file}`);
for (const file of written) console.log(`  write ${file}`);

if (errors.length > 0) {
	console.error("\nshadcn field derivation FAILED:");
	for (const message of errors) console.error(`  ✗ ${message}`);
	process.exit(1);
}

if (drifted.length > 0) {
	console.error(
		"\ncheck:fields-drift FAILED — generated field options are stale:",
	);
	for (const entry of drifted)
		console.error(`  ✗ ${entry.file} — ${entry.reason}`);
	console.error(
		"\nThe vendored @anvilkit/ui source no longer matches the committed goldens.",
	);
	console.error(
		"Run `pnpm gen:fields`, review the diff, then update the wrapper fields.",
	);
	process.exit(1);
}

const summary = check
	? `check:fields-drift OK — ${unchanged.length} golden(s) match source`
	: `gen:fields OK — ${written.length} written, ${unchanged.length} unchanged`;
console.log(
	`\n${summary}${skipped.length > 0 ? `, ${skipped.length} pending scaffold` : ""}`,
);
