import { Badge as BaseBadge } from "@anvilkit/ui/badge";
import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

/** Exact cva axis from `@anvilkit/ui` `badgeVariants` (DOC-01 §5.2). */
export type BadgeVariant =
	| "default"
	| "secondary"
	| "destructive"
	| "outline"
	| "ghost"
	| "link";

export interface BadgeProps {
	label: string;
	variant?: BadgeVariant;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface BadgeViewProps extends BadgeProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 target attributes stamped on the root element by the
	 * config adapter (serializable string map). The view never converts
	 * authored appearance into inline styles.
	 */
	rootAttrs?: Record<string, string>;
}

/**
 * The badge renders exactly ONE element — the `@anvilkit/ui` span — with
 * `label` as a bare text child, so `root` is the whole target map (the
 * PLAN-0027 §2.1 real-DOM rule; same analysis as the Button exemplar).
 * base-ui's `render` prop is deliberately not exposed (DOC-01 §3.6).
 */
export function Badge({
	label,
	variant = "default",
	classNames,
	animation,
	rootAttrs,
}: BadgeViewProps) {
	const anim = animationAttrs(animation);

	return (
		<BaseBadge
			{...rootAttrs}
			variant={variant}
			// §2.2: authored classes merge AFTER base classes so they win.
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		>
			{label}
		</BaseBadge>
	);
}
