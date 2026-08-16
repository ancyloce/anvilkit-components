import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Accordion as BaseAccordion,
} from "@anvilkit/ui/accordion";
import { cn } from "@anvilkit/ui/lib/utils";
import type { ReactNode } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";

/** One authored panel. `content` arrives already materialized by the config adapter. */
export interface AccordionItemView {
	title: string;
	content?: ReactNode;
}

export interface AccordionProps {
	/**
	 * Allow more than one panel open at once. Maps to base-ui
	 * `Accordion.Root`'s `multiple` prop — DOC-01 §5.17 guessed
	 * `openMultiple`; the installed types say `multiple` (OPEN-2 resolved).
	 */
	openMultiple?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface AccordionViewProps extends AccordionProps {
	items?: AccordionItemView[];
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`item`, `trigger`, `content`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

/**
 * `@anvilkit/ui` accordion over a Puck `array` of items, each carrying
 * its own `content` slot (DOC-01 §5.17; array-nested slots are
 * verified-supported by Puck 0.23 per §3.8). Panel values are the item
 * index.
 *
 * `keepMounted` is always on, so the rendered target structure is
 * identical in the editor, preview, publish and export. In `editMode`
 * every panel is additionally forced open (§5.17) so slot content stays
 * reachable on the canvas — an affordance, not a structural change.
 * Triggers are inert in `editMode` per §3.7.
 */
export function Accordion({
	items = [],
	openMultiple = false,
	editMode = false,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: AccordionViewProps) {
	const anim = animationAttrs(animation);
	const allOpen = items.map((_, index) => index);

	return (
		<BaseAccordion
			{...rootAttrs}
			multiple={editMode ? true : openMultiple}
			value={editMode ? allOpen : undefined}
			keepMounted
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		>
			{items.map((item, index) => (
				<AccordionItem
					{...targetAttrs?.item}
					// Item order IS the identity here — panel values are indices
					// (DOC-01 §5.17), so the index is the only stable key.
					// biome-ignore lint/suspicious/noArrayIndexKey: index is the panel value
					key={index}
					value={index}
					className={classNames?.item}
				>
					<AccordionTrigger
						{...targetAttrs?.trigger}
						disabled={editMode}
						className={classNames?.trigger}
					>
						{item.title}
					</AccordionTrigger>
					{/* No `content` style target: `@anvilkit/ui`'s AccordionContent
					    routes `className` to an INNER div while spreading other
					    props onto the outer Panel, so no single element can carry
					    both the stamp and the authored class. Fabricating a wrapper
					    to gain the target would violate PLAN-0027 §8.5. */}
					<AccordionContent>{item.content}</AccordionContent>
				</AccordionItem>
			))}
		</BaseAccordion>
	);
}
