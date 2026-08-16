import { cn } from "@anvilkit/ui/lib/utils";
import {
	Tooltip as BaseTooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@anvilkit/ui/tooltip";
import type { ReactNode } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";

/** Curated to the four physical sides (DOC-01 §5.15); the logical
 * `inline-start`/`inline-end` sides upstream also styles are excluded v1. */
export type TooltipSide = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
	content: string;
	side?: TooltipSide;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface TooltipViewProps extends TooltipProps {
	editMode?: boolean;
	/** Slot region, already materialized by the config adapter. */
	trigger?: ReactNode;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
}

/**
 * `@anvilkit/ui` tooltip (DOC-01 §5.15).
 *
 * The wrapper provides `TooltipProvider` **locally** (design 0022 §2) so
 * it never depends on the host app's layout. The trigger is rendered as
 * a `<span>` rather than base-ui's default button: the hover target is
 * whatever the author drops into the `trigger` slot, and nesting
 * interactive content inside a button would be invalid HTML.
 *
 * `editMode` forces the popup closed (DOC-01 §3.7): the canvas must
 * never portal a floating layer over the page being edited. Outside
 * edit mode `open` stays `undefined`, keeping base-ui uncontrolled.
 */
export function Tooltip({
	content,
	side = "top",
	trigger,
	editMode = false,
	classNames,
	animation,
	rootAttrs,
}: TooltipViewProps) {
	const anim = animationAttrs(animation);

	return (
		<TooltipProvider>
			<BaseTooltip open={editMode ? false : undefined}>
				<TooltipTrigger
					{...rootAttrs}
					render={<span />}
					className={cn(anim.className, classNames?.root)}
					style={anim.style}
				>
					{trigger}
				</TooltipTrigger>
				<TooltipContent side={side}>{content}</TooltipContent>
			</BaseTooltip>
		</TooltipProvider>
	);
}
