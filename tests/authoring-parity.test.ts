/**
 * PLAN-0025 Phase 3 — edit/production target-DOM parity (§6.4/§14.3,
 * P3-00 harness). For every ADOPTED package, the exact same target
 * attributes must exist whether the component renders on the
 * production path (Puck `<Render>`, node env — RSC-shaped) or in edit
 * mode (`editMode: true`, the demo adapters' editor signal):
 * `puck.isEditing`/`editMode` may control affordances only, never the
 * target structure. Server rendering keeps this suite inside the
 * workspace's node preset — no jsdom, no extra dependencies.
 */

import type { Config, Data } from "@puckeditor/core";
import { Render } from "@puckeditor/core";
import { createElement, type ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ADOPTED, configOf, REQUIRED_TARGETS } from "./authoring-helpers";

const PARITY_NODE_ID = "parity-node-1";

interface TargetStamp {
	readonly node?: string;
	readonly styleNode?: string;
	readonly styleTarget?: string;
}

/** Extract every element's data-ak-* stamps from static markup. */
function targetStamps(markup: string): TargetStamp[] {
	const stamps: TargetStamp[] = [];
	for (const tag of markup.match(/<[a-zA-Z][^>]*>/g) ?? []) {
		const node = tag.match(/data-ak-node="([^"]*)"/)?.[1];
		const styleNode = tag.match(/data-ak-style-node="([^"]*)"/)?.[1];
		const styleTarget = tag.match(/data-ak-style-target="([^"]*)"/)?.[1];
		if (
			node !== undefined ||
			styleNode !== undefined ||
			styleTarget !== undefined
		) {
			stamps.push({ node, styleNode, styleTarget });
		}
	}
	return stamps.sort((a, b) =>
		JSON.stringify(a).localeCompare(JSON.stringify(b)),
	);
}

/** class attribute of every element stamped with the given style target. */
function classesOfTarget(markup: string, targetId: string): string[] {
	const classes: string[] = [];
	for (const tag of markup.match(/<[a-zA-Z][^>]*>/g) ?? []) {
		if (tag.match(/data-ak-style-target="([^"]*)"/)?.[1] !== targetId) {
			continue;
		}
		classes.push(tag.match(/class="([^"]*)"/)?.[1] ?? "");
	}
	return classes;
}

/** Props for a direct edit-mode render: defaults + id + stub slots. */
function editModeProps(slug: string): Record<string, unknown> {
	const { componentConfig } = configOf(slug);
	const props: Record<string, unknown> = {
		...componentConfig.defaultProps,
		id: PARITY_NODE_ID,
		editMode: true,
	};
	for (const [name, field] of Object.entries(componentConfig.fields)) {
		const fieldType = (field as { type?: unknown }).type;
		if (fieldType === "slot") {
			// Slot containers must keep their stable target element even
			// with no children (§6.4); a null-rendering slot proves it.
			props[name] = () => null;
			continue;
		}
		// Slots nested inside `array` items (DOC-01 §3.8 — Tabs/Accordion).
		// Puck's runtime hands the adapter a SlotComponent per item; this
		// direct render must do the same or the adapter never sees the
		// shape it is written against.
		if (fieldType === "array") {
			const arrayFields =
				(field as { arrayFields?: Record<string, { type?: unknown }> })
					.arrayFields ?? {};
			const slotKeys = Object.keys(arrayFields).filter(
				(key) => arrayFields[key]?.type === "slot",
			);
			const items = props[name];
			if (slotKeys.length === 0 || !Array.isArray(items)) continue;
			props[name] = items.map((item) => {
				const next = { ...(item as Record<string, unknown>) };
				for (const key of slotKeys) next[key] = () => null;
				return next;
			});
		}
	}
	return props;
}

for (const slug of ADOPTED) {
	describe(`${slug}: Puck <Render> vs edit-mode target parity (§14.3)`, () => {
		const { componentConfig } = configOf(slug);
		const type = componentConfig.metadata.componentSlug;

		const productionMarkup = renderToStaticMarkup(
			createElement(Render, {
				config: { components: { [type]: componentConfig } } as Config,
				data: {
					content: [
						{
							type,
							props: { ...componentConfig.defaultProps, id: PARITY_NODE_ID },
						},
					],
					root: { props: {} },
					zones: {},
				} as Data,
			}),
		);
		const editMarkup = renderToStaticMarkup(
			componentConfig.render(editModeProps(slug)) as ReactElement,
		);

		it("production render stamps the root target with the node id", () => {
			const stamps = targetStamps(productionMarkup);
			expect(
				stamps.some(
					(stamp) =>
						stamp.node === PARITY_NODE_ID &&
						stamp.styleNode === PARITY_NODE_ID &&
						stamp.styleTarget === "root",
				),
				`${slug} production markup lacks the stamped root target`,
			).toBe(true);
		});

		it("declares every §6.5 required target in the production DOM", () => {
			const stamped = new Set(
				targetStamps(productionMarkup)
					.filter((stamp) => stamp.styleNode === PARITY_NODE_ID)
					.map((stamp) => stamp.styleTarget),
			);
			for (const required of REQUIRED_TARGETS[slug] ?? []) {
				expect(
					stamped.has(required),
					`${slug} production DOM lacks target "${required}"`,
				).toBe(true);
			}
		});

		it("edit-mode target structure is identical to production", () => {
			expect(targetStamps(editMarkup)).toEqual(targetStamps(productionMarkup));
		});

		// PLAN-0027 §2.2/§2.4 — the P2 fan-out is COMPLETE, so these are
		// unconditional: every package must declare both fields and every
		// declared target must genuinely accept an authored class.
		it("declares the §2.2/§2.4 fields", () => {
			expect(componentConfig.fields.classNames).toBeDefined();
			expect(componentConfig.fields.animation).toBeDefined();
		});

		{
			it("PLAN-0027 §2.2: authored classes land on every declared target, after base classes", () => {
				const declared = Object.keys(
					componentConfig.metadata.anvilkit?.editor?.styleTargets ?? {},
				);
				expect(declared.length).toBeGreaterThan(0);
				const classNames = Object.fromEntries(
					declared.map((targetId) => [targetId, `ak-authored-${targetId}`]),
				);
				const markup = renderToStaticMarkup(
					componentConfig.render({
						...editModeProps(slug),
						classNames,
					}) as ReactElement,
				);
				for (const targetId of declared) {
					const stamped = classesOfTarget(markup, targetId);
					expect(
						stamped.length,
						`${slug}/${targetId}: declared target has no stamped element in the default DOM`,
					).toBeGreaterThan(0);
					for (const classAttr of stamped) {
						expect(
							classAttr.endsWith(`ak-authored-${targetId}`),
							`${slug}/${targetId}: authored class must merge last, got "${classAttr}"`,
						).toBe(true);
					}
				}
			});
		}

		{
			it("PLAN-0027 §2.4: the animation preset stamps the root class pair + custom properties", () => {
				const markup = renderToStaticMarkup(
					componentConfig.render({
						...editModeProps(slug),
						animation: {
							preset: "fade-in",
							durationMs: 640,
							delayMs: 40,
							easing: "linear",
						},
					}) as ReactElement,
				);
				const rootTag = (markup.match(/<[a-zA-Z][^>]*>/g) ?? []).find((tag) =>
					tag.includes(`data-ak-node="${PARITY_NODE_ID}"`),
				);
				expect(rootTag, `${slug}: no stamped root element`).toBeDefined();
				const rootClass =
					rootTag?.match(/class="([^"]*)"/)?.[1]?.split(" ") ?? [];
				expect(rootClass).toContain("ak-anim");
				expect(rootClass).toContain("ak-anim-fade-in");
				expect(rootTag).toContain("--ak-anim-duration:640ms");
				expect(rootTag).toContain("--ak-anim-delay:40ms");
				expect(rootTag).toContain("--ak-anim-easing:linear");
			});
		}
	});
}

// The harness itself must run green while the ledger is empty; a
// no-assertion suite would otherwise report "no tests" and fail the
// evidence rule.
describe("parity harness", () => {
	it("is armed", () => {
		expect(Array.isArray(ADOPTED)).toBe(true);
	});
});
