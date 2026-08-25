import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { componentConfig as headingConfig } from "../src/heading/src/config";
import { Heading } from "../src/heading/src/Heading";
import { componentConfig as richTextConfig } from "../src/rich-text/src/config";
import { RichText } from "../src/rich-text/src/RichText";
import { componentConfig as textConfig } from "../src/text/src/config";
import { Text } from "../src/text/src/Text";

describe("typography components", () => {
	it("renders the selected semantic heading level", () => {
		const html = renderToStaticMarkup(
			createElement(Heading, { text: "Accessible structure", level: "h1" }),
		);

		expect(html).toMatch(/^<h1/);
		expect(html).toContain("Accessible structure");
		expect(html).toContain("text-4xl");
	});

	it("keeps authored heading classes last on the root target", () => {
		const html = renderToStaticMarkup(
			headingConfig.render({
				...headingConfig.defaultProps,
				id: "heading-test",
				classNames: { root: "tracking-wide" },
			}) as ReturnType<typeof createElement>,
		);

		expect(html).toContain('data-ak-node="heading-test"');
		expect(html).toContain('tracking-wide"');
		expect(headingConfig.metadata?.anvilkit?.editor?.inlineText).toEqual([
			{ id: "root", propPath: "text", format: "plain" },
		]);
	});

	it("renders multiline text without turning it into HTML", () => {
		const html = renderToStaticMarkup(
			createElement(Text, {
				text: "First line\n<script>unsafe()</script>",
				variant: "muted",
			}),
		);

		expect(html).toContain("whitespace-pre-line");
		expect(html).toContain("text-muted-foreground");
		expect(html).toContain("&lt;script&gt;unsafe()&lt;/script&gt;");
	});

	it("declares rich text through Puck and renders transformed React content", () => {
		const field = richTextConfig.fields.content;
		const html = renderToStaticMarkup(
			createElement(RichText, {
				content: createElement("p", null, "Formatted content"),
			}),
		);

		expect(field).toMatchObject({ type: "richtext", contentEditable: true });
		expect(html).toContain("<p>Formatted content</p>");
		expect(textConfig.fields.text).toMatchObject({ type: "textarea" });
	});
});
