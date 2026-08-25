import type { Slot } from "@puckeditor/core";
import type { ReactNode } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";

export type StackDirection = "vertical" | "horizontal";
export type StackGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type StackAlignment = "stretch" | "start" | "center" | "end";
export type StackJustification = "start" | "center" | "end" | "between";

export interface StackProps {
	content: Slot;
	direction?: StackDirection;
	gap?: StackGap;
	alignment?: StackAlignment;
	justification?: StackJustification;
	wrap?: boolean;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
}

export interface StackViewProps {
	content: ReactNode;
	direction?: StackDirection;
	gap?: StackGap;
	alignment?: StackAlignment;
	justification?: StackJustification;
	wrap?: boolean;
	editMode?: boolean;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
	rootAttrs?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}

const directionClasses: Record<StackDirection, string> = {
	vertical: "flex-col",
	horizontal: "flex-row",
};
const gapClasses: Record<StackGap, string> = {
	none: "gap-0",
	xs: "gap-1",
	sm: "gap-2",
	md: "gap-4",
	lg: "gap-6",
	xl: "gap-8",
};
const alignmentClasses: Record<StackAlignment, string> = {
	stretch: "items-stretch",
	start: "items-start",
	center: "items-center",
	end: "items-end",
};
const justificationClasses: Record<StackJustification, string> = {
	start: "justify-start",
	center: "justify-center",
	end: "justify-end",
	between: "justify-between",
};

function mergeClassNames(...classNames: (string | false | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

export function Stack({
	content,
	direction = "vertical",
	gap = "md",
	alignment = "stretch",
	justification = "start",
	wrap = false,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: StackViewProps) {
	const anim = animationAttrs(animation);
	return (
		<div
			{...rootAttrs}
			className={mergeClassNames("w-full", anim.className, classNames?.root)}
			style={anim.style}
		>
			<div
				{...targetAttrs?.content}
				className={mergeClassNames(
					"flex min-w-0",
					directionClasses[direction],
					gapClasses[gap],
					alignmentClasses[alignment],
					justificationClasses[justification],
					wrap && "flex-wrap",
					classNames?.content,
				)}
			>
				{content}
			</div>
		</div>
	);
}
