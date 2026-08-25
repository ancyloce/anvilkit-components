import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface ListItem {
	text: string;
}

export type ListStyle = "unordered" | "ordered";
export type ListSpacing = "compact" | "comfortable";

export interface ListProps {
	items: ListItem[];
	style?: ListStyle;
	spacing?: ListSpacing;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface ListViewProps extends ListProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`item`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

const spacingClasses: Record<ListSpacing, string> = {
	compact: "gap-1",
	comfortable: "gap-3",
};

export function List({
	items,
	style = "unordered",
	spacing = "comfortable",
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: ListViewProps) {
	const anim = animationAttrs(animation);
	const Element = style === "ordered" ? "ol" : "ul";
	const itemOccurrences = new Map<string, number>();
	const keyedItems = items.map((item) => {
		const occurrence = (itemOccurrences.get(item.text) ?? 0) + 1;
		itemOccurrences.set(item.text, occurrence);
		return { item, key: `${item.text}-${occurrence}` };
	});

	return (
		<Element
			{...rootAttrs}
			className={cn(
				"grid pl-6 text-base leading-7 text-foreground",
				style === "ordered" ? "list-decimal" : "list-disc",
				spacingClasses[spacing],
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			{keyedItems.map(({ item, key }) => (
				<li {...targetAttrs?.item} className={classNames?.item} key={key}>
					{item.text}
				</li>
			))}
		</Element>
	);
}
