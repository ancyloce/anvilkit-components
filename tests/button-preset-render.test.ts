/**
 * PRD 0022 FR-002 (plan 0036 P0-07) — the `preset` discriminator must be
 * strictly additive: the default ("marketing") render stays byte-identical
 * to the pre-preset output, and "system" renders pure shadcn
 * `buttonVariants` without the marketing pill overrides.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, type ButtonViewProps } from "../src/button/src/Button";

const render = (props: Partial<ButtonViewProps> = {}) =>
	renderToStaticMarkup(
		createElement(Button, { label: "Save changes", ...props }),
	);

describe("button preset discriminator (FR-002)", () => {
	it("default render is byte-identical to explicit preset=marketing", () => {
		expect(render()).toBe(render({ preset: "marketing" }));
	});

	it("marketing render keeps the pill base classes", () => {
		const html = render();
		for (const cls of ["h-11", "rounded-full", "px-5", "shadow-sm"]) {
			expect(html).toContain(cls);
		}
	});

	it("marketing variant mapping is unchanged (secondary → outline)", () => {
		expect(render({ variant: "secondary" })).not.toBe(render());
	});

	it("system render drops the marketing pill overrides", () => {
		const html = render({ preset: "system" });
		expect(html).not.toContain("rounded-full");
		expect(html).not.toBe(render());
	});

	it("system render honors variant and size", () => {
		const base = render({ preset: "system" });
		expect(render({ preset: "system", variant: "destructive" })).not.toBe(base);
		expect(render({ preset: "system", size: "sm" })).not.toBe(base);
	});

	it("marketing render ignores size (locked to the pill lg geometry)", () => {
		expect(render({ size: "sm" })).toBe(render());
	});
});
