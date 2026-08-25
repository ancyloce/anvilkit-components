import type { Slot } from "@puckeditor/core";
import type { ReactNode } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface ColumnItem {
	label: string;
	content: Slot;
}
export interface ColumnViewItem {
	label: string;
	content: ReactNode;
}
export type ColumnsGap = "none" | "sm" | "md" | "lg";
export type ColumnsCollapseAt = "never" | "sm" | "md" | "lg";
export type ColumnsAlignment = "stretch" | "start" | "center" | "end";

export interface ColumnsProps {
	columns: ColumnItem[];
	gap?: ColumnsGap;
	collapseAt?: ColumnsCollapseAt;
	alignment?: ColumnsAlignment;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
}
export interface ColumnsViewProps {
	columns: ColumnViewItem[];
	gap?: ColumnsGap;
	collapseAt?: ColumnsCollapseAt;
	alignment?: ColumnsAlignment;
	editMode?: boolean;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
	rootAttrs?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}

const gapClasses: Record<ColumnsGap, string> = {
	none: "gap-0",
	sm: "gap-2",
	md: "gap-4",
	lg: "gap-6",
};
const alignmentClasses: Record<ColumnsAlignment, string> = {
	stretch: "items-stretch",
	start: "items-start",
	center: "items-center",
	end: "items-end",
};
const columnCountClasses = {
	never: ["grid-cols-1", "grid-cols-2", "grid-cols-3", "grid-cols-4"],
	sm: [
		"grid-cols-1",
		"grid-cols-1 sm:grid-cols-2",
		"grid-cols-1 sm:grid-cols-3",
		"grid-cols-1 sm:grid-cols-4",
	],
	md: [
		"grid-cols-1",
		"grid-cols-1 md:grid-cols-2",
		"grid-cols-1 md:grid-cols-3",
		"grid-cols-1 md:grid-cols-4",
	],
	lg: [
		"grid-cols-1",
		"grid-cols-1 lg:grid-cols-2",
		"grid-cols-1 lg:grid-cols-3",
		"grid-cols-1 lg:grid-cols-4",
	],
} satisfies Record<ColumnsCollapseAt, readonly string[]>;

function mergeClassNames(...classNames: (string | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

export function Columns({
	columns,
	gap = "md",
	collapseAt = "md",
	alignment = "stretch",
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: ColumnsViewProps) {
	const anim = animationAttrs(animation);
	const countIndex = Math.max(0, Math.min(columns.length, 4) - 1);
	const occurrences = new Map<string, number>();
	const keyedColumns = columns.map((column) => {
		const occurrence = (occurrences.get(column.label) ?? 0) + 1;
		occurrences.set(column.label, occurrence);
		return { column, key: `${column.label}-${occurrence}` };
	});

	return (
		<div
			{...rootAttrs}
			className={mergeClassNames(
				"grid w-full",
				columnCountClasses[collapseAt][countIndex],
				gapClasses[gap],
				alignmentClasses[alignment],
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			{keyedColumns.map(({ column, key }) => (
				<div
					{...targetAttrs?.column}
					key={key}
					className={mergeClassNames("min-w-0", classNames?.column)}
				>
					{column.content}
				</div>
			))}
		</div>
	);
}
