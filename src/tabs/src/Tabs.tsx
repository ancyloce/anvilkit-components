import { cn } from "@anvilkit/ui/lib/utils";
import {
	Tabs as BaseTabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@anvilkit/ui/tabs";
import type { ReactNode } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";
import type { ListVariant } from "./generated/fields.gen";

export type TabsOrientation = "horizontal" | "vertical";

/** One authored tab. `content` arrives already materialized by the config adapter. */
export interface TabsItemView {
	label: string;
	content?: ReactNode;
}

export interface TabsProps {
	/** cva axis on `tabsListVariants`, derived by the codegen. */
	listVariant?: ListVariant;
	orientation?: TabsOrientation;
	defaultIndex?: number;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface TabsViewProps extends TabsProps {
	items?: TabsItemView[];
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`list`, `trigger`, `content`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

/**
 * `@anvilkit/ui` tabs over a Puck `array` of items, each carrying its own
 * `content` slot (DOC-01 §5.16; array-nested slots are verified-supported
 * by Puck 0.23 per §3.8). Tab values are the item index.
 *
 * Every panel is `keepMounted`, so the rendered target structure is
 * identical in the editor, preview, publish and export — only which
 * panel is visible differs, which is an affordance, not structure.
 *
 * `editMode` makes the triggers inert per DOC-01 §3.7; the active panel
 * stays the canvas-editable one.
 */
export function Tabs({
	items = [],
	listVariant = "default",
	orientation = "horizontal",
	defaultIndex = 0,
	editMode = false,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: TabsViewProps) {
	const anim = animationAttrs(animation);
	// Authors can delete the item a stale `defaultIndex` pointed at.
	const activeIndex =
		items.length === 0
			? 0
			: Math.min(Math.max(defaultIndex, 0), items.length - 1);

	return (
		<BaseTabs
			{...rootAttrs}
			defaultValue={activeIndex}
			orientation={orientation}
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		>
			<TabsList
				{...targetAttrs?.list}
				variant={listVariant}
				className={classNames?.list}
			>
				{items.map((item, index) => (
					<TabsTrigger
						{...targetAttrs?.trigger}
						// Item order IS the identity here — tab values are indices
						// (DOC-01 §5.16), so the index is the only stable key.
						// biome-ignore lint/suspicious/noArrayIndexKey: index is the tab value
						key={index}
						value={index}
						disabled={editMode}
						className={classNames?.trigger}
					>
						{item.label}
					</TabsTrigger>
				))}
			</TabsList>
			{items.map((item, index) => (
				<TabsContent
					{...targetAttrs?.content}
					// biome-ignore lint/suspicious/noArrayIndexKey: index is the tab value
					key={index}
					value={index}
					keepMounted
					className={classNames?.content}
				>
					{item.content}
				</TabsContent>
			))}
		</BaseTabs>
	);
}
