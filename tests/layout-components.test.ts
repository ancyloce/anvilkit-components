import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Columns } from "../src/columns/src/Columns";
import { componentConfig as columnsConfig } from "../src/columns/src/config";
import { componentConfig as gridConfig } from "../src/grid/src/config";
import { Grid } from "../src/grid/src/Grid";
import { componentConfig as stackConfig } from "../src/stack/src/config";
import { Stack } from "../src/stack/src/Stack";

describe("layout primitives", () => {
	it("stacks slotted content with authored flex behavior", () => {
		const html = renderToStaticMarkup(
			createElement(Stack, {
				content: createElement("span", null, "Stack item"),
				direction: "horizontal",
				gap: "lg",
				alignment: "center",
				justification: "between",
				wrap: true,
			}),
		);

		expect(html).toContain("flex-row");
		expect(html).toContain("gap-6");
		expect(html).toContain("items-center");
		expect(html).toContain("justify-between");
		expect(html).toContain("flex-wrap");
		expect(stackConfig.fields.content).toMatchObject({ type: "slot" });
	});

	it("renders responsive fixed and automatic grids", () => {
		const fixed = renderToStaticMarkup(
			createElement(Grid, {
				content: createElement("span", null, "Grid item"),
				columns: "4",
			}),
		);
		const automatic = renderToStaticMarkup(
			createElement(Grid, {
				content: createElement("span", null, "Grid item"),
				columns: "auto",
			}),
		);

		expect(fixed).toContain("lg:grid-cols-4");
		expect(automatic).toContain("repeat(auto-fit");
		expect(gridConfig.fields.columns).toMatchObject({ type: "select" });
	});

	it("renders two to four independently slotted responsive columns", () => {
		const html = renderToStaticMarkup(
			createElement(Columns, {
				columns: [
					{ label: "A", content: createElement("p", null, "One") },
					{ label: "B", content: createElement("p", null, "Two") },
					{ label: "C", content: createElement("p", null, "Three") },
				],
				collapseAt: "lg",
			}),
		);

		expect(html).toContain("lg:grid-cols-3");
		expect(html.match(/<p/g)).toHaveLength(3);
		expect(columnsConfig.fields.columns).toMatchObject({
			type: "array",
			min: 2,
			max: 4,
			arrayFields: { content: { type: "slot" } },
		});
	});

	it("stamps every repeated column target through the Puck adapter", () => {
		const html = renderToStaticMarkup(
			columnsConfig.render({
				...columnsConfig.defaultProps,
				id: "columns-test",
				columns: [
					{ label: "One", content: () => null },
					{ label: "Two", content: () => null },
				],
			}) as ReturnType<typeof createElement>,
		);

		expect(html).toContain('data-ak-node="columns-test"');
		expect(html.match(/data-ak-style-target="column"/g)).toHaveLength(2);
	});
});
