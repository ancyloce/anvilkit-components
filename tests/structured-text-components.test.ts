import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Blockquote } from "../src/blockquote/src/Blockquote";
import { componentConfig as blockquoteConfig } from "../src/blockquote/src/config";
import { Code } from "../src/code/src/Code";
import { componentConfig as codeConfig } from "../src/code/src/config";
import { componentConfig as listConfig } from "../src/list/src/config";
import { List } from "../src/list/src/List";

describe("structured text components", () => {
	it("renders a semantic quote and optional citation", () => {
		const html = renderToStaticMarkup(
			createElement(Blockquote, {
				quote: "Make the structure clear.",
				citation: "AnvilKit",
			}),
		);

		expect(html).toContain("<figure");
		expect(html).toContain("<blockquote");
		expect(html).toContain("<figcaption");
		expect(html).toContain("Make the structure clear.");
		expect(blockquoteConfig.metadata?.anvilkit?.editor?.inlineText).toEqual([
			{ id: "quote", propPath: "quote", format: "plain" },
			{ id: "citation", propPath: "citation", format: "plain" },
		]);
	});

	it("escapes code and can render accessible line numbers", () => {
		const html = renderToStaticMarkup(
			createElement(Code, {
				code: "<script>unsafe()</script>\nreturn true;",
				language: "javascript",
				showLineNumbers: true,
			}),
		);

		expect(html).toContain("<pre");
		expect(html).toContain('data-language="javascript"');
		expect(html).toContain("&lt;script&gt;unsafe()&lt;/script&gt;");
		expect(html).toContain('aria-hidden="true">1</span>');
		expect(codeConfig.fields.language).toMatchObject({ type: "select" });
	});

	it("switches between ordered and unordered array-backed lists", () => {
		const ordered = renderToStaticMarkup(
			createElement(List, {
				items: [{ text: "First" }, { text: "Second" }],
				style: "ordered",
			}),
		);
		const unordered = renderToStaticMarkup(
			createElement(List, {
				items: [{ text: "First" }],
				style: "unordered",
			}),
		);

		expect(ordered).toMatch(/^<ol/);
		expect(ordered).toContain("list-decimal");
		expect(unordered).toMatch(/^<ul/);
		expect(listConfig.fields.items).toMatchObject({
			type: "array",
			arrayFields: { text: { type: "text" } },
		});
	});

	it("stamps stable root and named style targets through each config", () => {
		for (const [id, config, expectedTargets] of [
			["blockquote-test", blockquoteConfig, ["quote", "citation"]],
			["code-test", codeConfig, ["code"]],
			["list-test", listConfig, ["item"]],
		] as const) {
			const html = renderToStaticMarkup(
				config.render({
					...config.defaultProps,
					id,
				}) as ReturnType<typeof createElement>,
			);

			expect(html).toContain(`data-ak-node="${id}"`);
			for (const target of expectedTargets) {
				expect(html).toContain(`data-ak-style-target="${target}"`);
			}
		}
	});
});
