/**
 * PLAN-0025 Phase 3 — per-package authoring contract (§6, P3-00
 * harness). For every ADOPTED package: metadata v2 declares at least
 * the §6.5 required targets with vocabulary-only property allowlists;
 * the three hidden authoring fields are declared per §5.3 (with the
 * locked 0.22.4 erratum: render returns an element, never null);
 * `defaultProps` never stamps empty authoring shells; and every
 * package's self-contained `authoring.ts` is structurally IDENTICAL —
 * including the exact data-attribute literals the superproject
 * compiler selects on — so per-package self-containment can never
 * drift into the incompatible variants §5.3 prohibits.
 */

import { describe, expect, it } from "vitest";
import {
	ADOPTED,
	AUTHORABLE_PROPERTIES,
	authoringOf,
	configOf,
	discoveredAuthoringSlugs,
	REQUIRED_TARGETS,
} from "./authoring-helpers";

const AUTHORING_FIELD_KEYS = [
	"appearance",
	"interactions",
	"bindings",
] as const;

describe("authoring adoption ledger", () => {
	it("every discovered authoring.ts belongs to a package in ADOPTED (no drive-by adoption)", () => {
		expect(discoveredAuthoringSlugs()).toEqual([...ADOPTED].sort());
	});

	it("every adopted slug is a known §6.5 component", () => {
		for (const slug of ADOPTED) {
			expect(REQUIRED_TARGETS[slug], slug).toBeDefined();
		}
	});
});

for (const slug of ADOPTED) {
	describe(`${slug}: metadata v2 (§6.1/§6.5)`, () => {
		it("declares version 2 with at least the required targets", () => {
			const editor = configOf(slug).componentConfig.metadata.anvilkit?.editor;
			expect(editor?.version).toBe("2");
			const targets = Object.keys(editor?.styleTargets ?? {});
			for (const required of REQUIRED_TARGETS[slug] ?? []) {
				expect(targets, `${slug} must declare target "${required}"`).toContain(
					required,
				);
			}
		});

		it("every target has a label and a vocabulary-only property allowlist", () => {
			const styleTargets =
				configOf(slug).componentConfig.metadata.anvilkit?.editor
					?.styleTargets ?? {};
			expect(Object.keys(styleTargets).length).toBeGreaterThan(0);
			for (const [targetId, target] of Object.entries(styleTargets)) {
				expect(
					typeof target.label === "string" && target.label.length > 0,
					`${slug}/${targetId} label`,
				).toBe(true);
				expect(Array.isArray(target.properties), `${slug}/${targetId}`).toBe(
					true,
				);
				const properties = target.properties as string[];
				expect(properties.length).toBeGreaterThan(0);
				for (const property of properties) {
					expect(
						AUTHORABLE_PROPERTIES,
						`${slug}/${targetId} grants unknown property "${property}"`,
					).toContain(property);
				}
				expect(new Set(properties).size).toBe(properties.length);
				if (target.responsive !== undefined) {
					expect(typeof target.responsive).toBe("boolean");
				}
			}
		});
	});

	describe(`${slug}: hidden authoring fields (§5.3)`, () => {
		it("declares appearance/interactions/bindings as hidden custom fields", () => {
			const fields = configOf(slug).componentConfig.fields as Record<
				string,
				{ type?: unknown; visible?: unknown; render?: unknown }
			>;
			for (const key of AUTHORING_FIELD_KEYS) {
				const field = fields[key];
				expect(field, `${slug} field "${key}"`).toBeDefined();
				expect(field?.type).toBe("custom");
				expect(field?.visible).toBe(false);
				expect(typeof field?.render).toBe("function");
			}
		});

		it("defaultProps never stamps empty authoring shells", () => {
			const defaults = configOf(slug).componentConfig.defaultProps;
			for (const key of AUTHORING_FIELD_KEYS) {
				expect(
					Object.hasOwn(defaults, key),
					`${slug} defaultProps must not carry "${key}"`,
				).toBe(false);
			}
		});
	});

	describe(`${slug}: authoring.ts structural identity (§5.3/§6.2)`, () => {
		it("emits the exact target-attribute literals the compiler selects on", () => {
			const authoring = authoringOf(slug);
			expect(authoring.anvilRootAttrs("n-1")).toEqual({
				"data-ak-node": "n-1",
				"data-ak-style-node": "n-1",
				"data-ak-style-target": "root",
			});
			expect(authoring.anvilRootAttrs("n-1", "frame")).toEqual({
				"data-ak-node": "n-1",
				"data-ak-style-node": "n-1",
				"data-ak-style-target": "frame",
			});
			expect(authoring.anvilTargetAttrs("n-1", "content")).toEqual({
				"data-ak-style-node": "n-1",
				"data-ak-style-target": "content",
			});
		});

		it("hidden fields match the §5.3 shape and render an element (0.22.4 erratum)", () => {
			const authoring = authoringOf(slug);
			for (const field of [
				authoring.appearanceField,
				authoring.interactionsField,
				authoring.bindingsField,
			]) {
				expect(field.type).toBe("custom");
				expect(field.visible).toBe(false);
				const rendered = (field.render as () => unknown)();
				expect(rendered).not.toBeNull();
				expect(typeof rendered).toBe("object");
			}
		});
	});
}

describe("cross-package identity", () => {
	it("all adopted packages share one structural authoring surface", () => {
		const shapes = ADOPTED.map((slug) => {
			const authoring = authoringOf(slug);
			return JSON.stringify({
				root: authoring.anvilRootAttrs("x"),
				target: authoring.anvilTargetAttrs("x", "t"),
				fields: [
					authoring.appearanceField,
					authoring.interactionsField,
					authoring.bindingsField,
				].map((field) => ({ type: field.type, visible: field.visible })),
			});
		});
		expect(new Set(shapes).size).toBeLessThanOrEqual(1);
	});
});
