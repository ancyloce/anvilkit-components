import { cn } from "@anvilkit/ui/lib/utils";
import {
	Table as BaseTable,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@anvilkit/ui/table";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface TableColumn {
	header: string;
}

export interface TableCellValue {
	value: string;
}

export interface TableRowData {
	cells: TableCellValue[];
}

export interface TableProps {
	caption?: string;
	columns?: TableColumn[];
	rows?: TableRowData[];
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface TableViewProps extends TableProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id. */
	targetAttrs?: Record<string, Record<string, string>>;
}

/**
 * `@anvilkit/ui` table over two Puck arrays (DOC-01 §5.18). Cells are
 * text-only in v1 — component content in cells (a slot nested in an
 * array nested in an array) is explicitly excluded for projection and
 * depth reasons.
 *
 * Row/column count mismatch is resolved deterministically and never
 * raises a validation error: short rows are padded with empty cells and
 * extra cells are ignored.
 *
 * Non-interactive — nothing to make inert for `editMode`.
 */
export function Table({
	caption,
	columns = [],
	rows = [],
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: TableViewProps) {
	const anim = animationAttrs(animation);

	return (
		<BaseTable
			{...rootAttrs}
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		>
			{/* §5.18: an empty caption renders no <caption> at all. */}
			{caption ? (
				<TableCaption {...targetAttrs?.caption} className={classNames?.caption}>
					{caption}
				</TableCaption>
			) : null}
			<TableHeader>
				<TableRow {...targetAttrs?.row} className={classNames?.row}>
					{columns.map((column, index) => (
						<TableHead
							{...targetAttrs?.header}
							// Column order IS the identity — there is no stable id on an
							// authored column, and reordering re-renders the whole header.
							// biome-ignore lint/suspicious/noArrayIndexKey: positional data
							key={index}
							className={classNames?.header}
						>
							{column.header}
						</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map((row, rowIndex) => (
					<TableRow
						{...targetAttrs?.row}
						// biome-ignore lint/suspicious/noArrayIndexKey: positional data
						key={rowIndex}
						className={classNames?.row}
					>
						{columns.map((_, cellIndex) => (
							<TableCell
								{...targetAttrs?.cell}
								// biome-ignore lint/suspicious/noArrayIndexKey: positional data
								key={cellIndex}
								className={classNames?.cell}
							>
								{row.cells?.[cellIndex]?.value ?? ""}
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</BaseTable>
	);
}
