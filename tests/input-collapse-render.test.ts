/**
 * PRD 0022 FR-002 (plan 0036 P0-08) — `label` collapse-when-empty: bare
 * controls render no empty label span; labeled renders are unchanged.
 */
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Input, type InputViewProps } from "../src/input/src/Input";

const render = (props: Partial<InputViewProps> = {}) =>
	renderToStaticMarkup(createElement(Input, { name: "email", ...props }));

describe("input label collapse (FR-002)", () => {
	it("bare control renders no label span at all", () => {
		expect(render()).not.toContain("<span");
		expect(render({ label: "" })).not.toContain("<span");
	});

	it("labeled render keeps the label span with its classes", () => {
		const html = render({ label: "Email address" });
		expect(html).toContain("<span");
		expect(html).toContain("Email address");
		expect(html).toContain("font-semibold");
	});

	it("helper text still renders independently of the label", () => {
		const html = render({ helperText: "We never share this." });
		expect(html).toContain("We never share this.");
		expect(html).not.toContain("font-semibold");
	});

	it("required marker rides the label and vanishes with it", () => {
		expect(render({ label: "Email", required: true })).toContain(" *");
		expect(render({ required: true })).not.toContain(" *");
	});
});
