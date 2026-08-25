import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingAlignment = "left" | "center" | "right";

export interface HeadingProps {
	text: string;
	level?: HeadingLevel;
	alignment?: HeadingAlignment;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface HeadingViewProps extends HeadingProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
}

const alignmentClasses: Record<HeadingAlignment, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

const levelClasses: Record<HeadingLevel, string> = {
	h1: "text-4xl sm:text-5xl lg:text-6xl",
	h2: "text-3xl sm:text-4xl",
	h3: "text-2xl sm:text-3xl",
	h4: "text-xl sm:text-2xl",
	h5: "text-lg sm:text-xl",
	h6: "text-base sm:text-lg",
};

export function Heading({
	text,
	level = "h2",
	alignment = "left",
	classNames,
	animation,
	rootAttrs,
}: HeadingViewProps) {
	const anim = animationAttrs(animation);
	const Element = level;

	return (
		<Element
			{...rootAttrs}
			className={cn(
				"text-balance font-semibold tracking-tight text-foreground",
				levelClasses[level],
				alignmentClasses[alignment],
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			{text}
		</Element>
	);
}
