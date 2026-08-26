import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { Accordion } from "../src/accordion/src/Accordion";

type ElementWithChildren = ReactElement<{ children?: ReactNode }>;

describe("Accordion rendering", () => {
	it("assigns stable keys to the trigger and content children of every item", () => {
		const root = Accordion({
			items: [
				{ title: "First", content: "First content" },
				{ title: "Second", content: "Second content" },
			],
		}) as ElementWithChildren;
		const itemElements = root.props.children as ElementWithChildren[];

		for (const itemElement of itemElements) {
			const itemChildren = itemElement.props.children as ReactElement[];
			expect(itemChildren.map((child) => child.key)).toEqual([
				"trigger",
				"content",
			]);
		}
	});
});
