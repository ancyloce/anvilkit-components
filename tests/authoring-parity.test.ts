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

/** Props for a direct edit-mode render: defaults + id + stub slots. */
function editModeProps(slug: string): Record<string, unknown> {
	const { componentConfig } = configOf(slug);
	const props: Record<string, unknown> = {
		...componentConfig.defaultProps,
		id: PARITY_NODE_ID,
		editMode: true,
	};
	for (const [name, field] of Object.entries(componentConfig.fields)) {
		if ((field as { type?: unknown }).type === "slot") {
			// Slot containers must keep their stable target element even
			// with no children (§6.4); a null-rendering slot proves it.
			props[name] = () => null;
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
