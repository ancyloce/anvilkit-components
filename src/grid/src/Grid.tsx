import type { Slot } from "@puckeditor/core";
import type { ReactNode } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";

export type GridColumns = "1" | "2" | "3" | "4" | "auto";
export type GridGap = "none" | "xs" | "sm" | "md" | "lg" | "xl";
export type GridAlignment = "stretch" | "start" | "center" | "end";

export interface GridProps {
	content: Slot;
	columns?: GridColumns;
	gap?: GridGap;
	alignment?: GridAlignment;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
}
export interface GridViewProps {
	content: ReactNode;
	columns?: GridColumns;
	gap?: GridGap;
	alignment?: GridAlignment;
	editMode?: boolean;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
	rootAttrs?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}

const columnClasses: Record<GridColumns, string> = {
	"1": "grid-cols-1",
	"2": "grid-cols-1 sm:grid-cols-2",
	"3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
	"4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
	auto: "grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))]",
};
const gapClasses: Record<GridGap, string> = {
	none: "gap-0",
	xs: "gap-1",
	sm: "gap-2",
	md: "gap-4",
	lg: "gap-6",
	xl: "gap-8",
};
const alignmentClasses: Record<GridAlignment, string> = {
	stretch: "items-stretch",
	start: "items-start",
	center: "items-center",
	end: "items-end",
};

function mergeClassNames(...classNames: (string | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

export function Grid({
	content,
	columns = "3",
	gap = "md",
	alignment = "stretch",
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: GridViewProps) {
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
					"grid min-w-0",
					columnClasses[columns],
					gapClasses[gap],
					alignmentClasses[alignment],
					classNames?.content,
				)}
			>
				{content}
			</div>
		</div>
	);
}
