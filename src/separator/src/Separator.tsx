import { cn } from "@anvilkit/ui/lib/utils";
import { Separator as BaseSeparator } from "@anvilkit/ui/separator";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface SeparatorProps {
	orientation?: "horizontal" | "vertical";
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface SeparatorViewProps extends SeparatorProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 target attributes stamped on the root element by the
	 * config adapter (serializable string map). The view never converts
	 * authored appearance into inline styles.
	 */
	rootAttrs?: Record<string, string>;
}

/**
 * The wrapper renders exactly ONE element — the `@anvilkit/ui` separator,
 * which base-ui gives a `separator` role and the `data-horizontal` /
 * `data-vertical` attributes its own classes key off. `root` is therefore
 * the whole target map (PLAN-0027 §2.1 real-DOM rule). Non-interactive,
 * so `editMode` needs no inert handling.
 */
export function Separator({
	orientation = "horizontal",
	classNames,
	animation,
	rootAttrs,
}: SeparatorViewProps) {
	const anim = animationAttrs(animation);

	return (
		<BaseSeparator
			{...rootAttrs}
			orientation={orientation}
			// §2.2: authored classes merge AFTER base classes so they win.
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		/>
	);
}
