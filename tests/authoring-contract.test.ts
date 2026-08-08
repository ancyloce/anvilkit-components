/**
 * PLAN-0025 Phase 3 — per-package authoring contract (§6, P3-00
 * harness). For every ADOPTED package: metadata v2 declares at least
 * the §6.5 required targets with vocabulary-only property allowlists;
 * the three hidden authoring fields are declared per §5.3 (with the
 * locked 0.23.0 erratum: render returns an element, never null);
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

/**
 * PLAN-0027 §2.5 canonical helper surface. The pilot (blog-list) must
 * ship it; every other package ships it all-or-nothing until the P2
 * fan-out completes the fleet — after which every package carries the
 * verbatim copy and the all-or-nothing branch never tolerates absence
 * again.
 */
const PLAN_0027_HELPER_KEYS = [
	"classNamesField",
	"animationField",
	"animationAttrs",
] as const;

const ANIMATION_FIELD_LABELS = {
	label: "Animation",
	preset: "Preset",
	presetOptions: {
		none: "None",
		"fade-in": "Fade in",
		"slide-up": "Slide up",
		"slide-down": "Slide down",
		"zoom-in": "Zoom in",
	},
	duration: "Duration",
	delay: "Delay",
	easing: "Easing",
};

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

	describe(`${slug}: static config stays adapter-free (PLAN-0027 §2.3)`, () => {
		it("declares no external field and no resolveData", () => {
			// NOTE: `fields.dataSource` is deliberately NOT asserted absent
			// fleet-wide — `statistics` ships a pre-existing business prop
			// of that name ("static" | "remote_csv"); its P2 fan-out must
			// reconcile it with the §2.3 adapter-injected select.
			const { componentConfig } = configOf(slug);
			expect(componentConfig.resolveData).toBeUndefined();
			expect(componentConfig.fields.externalData).toBeUndefined();
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

		it("hidden fields match the §5.3 shape and render an element (0.23.0 erratum)", () => {
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

	describe(`${slug}: PLAN-0027 §2.5 authoring helpers`, () => {
		const authoring = authoringOf(slug);
		const present = PLAN_0027_HELPER_KEYS.filter(
			(key) => authoring[key] !== undefined,
		);

		// P2 fan-out is COMPLETE: every ADOPTED package ships the full
		// §2.5 surface, so the transitional "0 helpers is also legal"
		// allowance is gone — a missing or partial copy now fails.
		it("ships the complete §2.5 helper surface", () => {
			expect(
				present,
				`${slug} ships an incomplete PLAN-0027 surface: ${present.join(", ")}`,
			).toEqual([...PLAN_0027_HELPER_KEYS]);
		});

		{
			it("classNamesField builds one text sub-field per target, in order", () => {
				const field = authoring.classNamesField?.(
					[
						{ id: "root", label: "Root" },
						{ id: "item", label: "Item" },
					],
					"Custom classes",
				) as {
					type: string;
					label?: string;
					objectFields: Record<string, unknown>;
				};
				expect(field).toEqual({
					type: "object",
					label: "Custom classes",
					objectFields: {
						root: { type: "text", label: "Root" },
						item: { type: "text", label: "Item" },
					},
				});
				expect(Object.keys(field.objectFields)).toEqual(["root", "item"]);
			});

			it("animationField matches the §2.4 object-field shape", () => {
				const field = authoring.animationField?.(ANIMATION_FIELD_LABELS) as {
					type: string;
					label?: string;
					objectFields: Record<
						string,
						{ type: string; options?: { label: string; value: string }[] }
					>;
				};
				expect(field.type).toBe("object");
				expect(field.label).toBe("Animation");
				expect(Object.keys(field.objectFields)).toEqual([
					"preset",
					"durationMs",
					"delayMs",
					"easing",
				]);
				expect(field.objectFields.preset.type).toBe("select");
				expect(
					field.objectFields.preset.options?.map((option) => option.value),
				).toEqual(["none", "fade-in", "slide-up", "slide-down", "zoom-in"]);
				expect(field.objectFields.durationMs.type).toBe("number");
				expect(field.objectFields.delayMs.type).toBe("number");
				expect(field.objectFields.easing.type).toBe("select");
				expect(
					field.objectFields.easing.options?.map((option) => option.value),
				).toEqual(["ease", "ease-in", "ease-out", "ease-in-out", "linear"]);
			});

			it("animationAttrs emits the root class pair + custom properties", () => {
				expect(authoring.animationAttrs?.(undefined)).toEqual({});
				expect(authoring.animationAttrs?.({ preset: "none" })).toEqual({});
				expect(
					authoring.animationAttrs?.({
						preset: "fade-in",
						durationMs: 750,
						delayMs: 100,
						easing: "linear",
					}),
				).toEqual({
					className: "ak-anim ak-anim-fade-in",
					style: {
						"--ak-anim-duration": "750ms",
						"--ak-anim-delay": "100ms",
						"--ak-anim-easing": "linear",
					},
				});
				// §2.4 defaults: 500ms / 0ms / ease.
				expect(authoring.animationAttrs?.({ preset: "zoom-in" })).toEqual({
					className: "ak-anim ak-anim-zoom-in",
					style: {
						"--ak-anim-duration": "500ms",
						"--ak-anim-delay": "0ms",
						"--ak-anim-easing": "ease",
					},
				});
			});
		}
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

	it("every package's PLAN-0027 §2.5 surface shares one structural shape", () => {
		const shapes = ADOPTED.map((slug) => {
			const authoring = authoringOf(slug);
			return JSON.stringify({
				classNames: authoring.classNamesField?.([{ id: "a", label: "A" }], "L"),
				animation: authoring.animationField?.(ANIMATION_FIELD_LABELS),
				attrs: authoring.animationAttrs?.({ preset: "fade-in" }),
			});
		});
		expect(shapes.length).toBeGreaterThan(0);
		expect(new Set(shapes).size).toBeLessThanOrEqual(1);
	});
});

describe("PLAN-0027 pilot: blog-list is the golden reference", () => {
	it("ships the full §2.5 authoring surface", () => {
		const authoring = authoringOf("blog-list");
		for (const key of PLAN_0027_HELPER_KEYS) {
			expect(typeof authoring[key], `blog-list must export ${key}`).toBe(
				"function",
			);
		}
	});

	describe("§2.3 data-source factory", () => {
		const module = configOf("blog-list");
		const fetchList = async (): Promise<unknown[]> => [];

		it("adapter presence adds dataSource/externalData fields + resolveData", () => {
			const config = module.createComponentConfig({
				dataSources: { posts: { fetchList, showSearch: true } },
			});
			expect(config.fields.dataSource).toMatchObject({ type: "select" });
			expect(config.fields.externalData).toMatchObject({
				type: "external",
				showSearch: true,
			});
			expect(typeof config.resolveData).toBe("function");
			// The data-source fields sit between the collection and the
			// §2.4/§2.2 presentation fields.
			expect(Object.keys(config.fields)).toEqual([
				"appearance",
				"interactions",
				"bindings",
				"posts",
				"dataSource",
				"externalData",
				"animation",
				"classNames",
			]);
		});

		it("no-adapter factory output is field-identical to the static config", () => {
			const config = module.createComponentConfig();
			expect(config.resolveData).toBeUndefined();
			expect(Object.keys(config.fields)).toEqual(
				Object.keys(module.componentConfig.fields),
			);
		});

		it("resolveData maps the external selection into posts and locks the array", () => {
			const config = module.createComponentConfig({
				dataSources: {
					posts: {
						fetchList,
						mapItem: (item: unknown) => ({
							...(item as Record<string, unknown>),
							title: `mapped:${(item as { title: string }).title}`,
						}),
					},
				},
			});
			const resolveData = config.resolveData as (
				data: { props: Record<string, unknown> },
				params: { changed: Record<string, boolean> },
			) => {
				props: Record<string, unknown>;
				readOnly?: Record<string, boolean>;
			};

			// changed-guard (Puck dynamic-props docs): unrelated edits are a no-op.
			expect(
				resolveData(
					{
						props: {
							dataSource: "external",
							externalData: [{ title: "a" }],
						},
					},
					{ changed: {} },
				),
			).toEqual({ props: {} });

			// An external array selection maps item-by-item into posts.
			const resolved = resolveData(
				{
					props: {
						dataSource: "external",
						externalData: [{ title: "a" }, { title: "b" }],
					},
				},
				{ changed: { externalData: true } },
			);
			expect(resolved.readOnly).toEqual({ posts: true });
			expect(
				(resolved.props.posts as { title: string }[]).map((post) => post.title),
			).toEqual(["mapped:a", "mapped:b"]);

			// A single-object selection is wrapped into a one-item list.
			const single = resolveData(
				{
					props: { dataSource: "external", externalData: { title: "solo" } },
				},
				{ changed: { externalData: true } },
			);
			expect(
				(single.props.posts as { title: string }[]).map((post) => post.title),
			).toEqual(["mapped:solo"]);

			// External mode with no selection: posts stay untouched but locked.
			expect(
				resolveData(
					{ props: { dataSource: "external" } },
					{ changed: { dataSource: true } },
				),
			).toEqual({ props: {}, readOnly: { posts: true } });

			// Static mode releases the lock.
			expect(
				resolveData(
					{ props: { dataSource: "static" } },
					{ changed: { dataSource: true } },
				),
			).toEqual({ props: {}, readOnly: { posts: false } });
		});
	});
});
