import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Container } from "../src/container/src/Container";
import { componentConfig as containerConfig } from "../src/container/src/config";
import { componentConfig as spacerConfig } from "../src/spacer/src/config";
import { Spacer } from "../src/spacer/src/Spacer";

describe("container primitives", () => {
	it("renders one composable slot inside a constrained container", () => {
		const html = renderToStaticMarkup(
			createElement(Container, {
				content: createElement("p", null, "Nested content"),
				maxWidth: "sm",
				padding: "lg",
				alignment: "end",
			}),
		);

		expect(html).toContain("max-w-screen-sm");
		expect(html).toContain("sm:p-8");
		expect(html).toContain("ms-auto");
		expect(html).toContain("Nested content");
		expect(containerConfig.fields.content).toMatchObject({ type: "slot" });
	});

	it("keeps spacer semantics silent while making edit mode selectable", () => {
		const published = renderToStaticMarkup(
			createElement(Spacer, { size: "lg" }),
		);
		const editing = renderToStaticMarkup(
			createElement(Spacer, { size: "lg", editMode: true }),
		);

		expect(published).toContain('aria-hidden="true"');
		expect(published).toContain("h-24");
		expect(editing).toContain("border-dashed");
		expect(spacerConfig.fields.size).toMatchObject({ type: "radio" });
	});

	it("stamps stable root and content targets through the container config", () => {
		const html = renderToStaticMarkup(
			containerConfig.render({
				...containerConfig.defaultProps,
				id: "container-test",
				content: () => createElement("span", null, "Slot"),
			}) as ReturnType<typeof createElement>,
		);

		expect(html).toContain('data-ak-node="container-test"');
		expect(html).toContain('data-ak-style-target="content"');
	});
});
