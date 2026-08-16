import { Label as BaseLabel } from "@anvilkit/ui/label";
import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface LabelProps {
	text: string;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface LabelViewProps extends LabelProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
}

/**
 * Bare `@anvilkit/ui` label (DOC-01 §5.8). `htmlFor` is deliberately not
 * a field: §3.6 bans cross-node reference props, so pairing happens
 * inside a single wrapper's render (see the `checkbox`/`switch`
 * packages), never across Puck nodes. Primary use is inside Card and
 * other slot compositions.
 */
export function Label({
	text,
	classNames,
	animation,
	rootAttrs,
}: LabelViewProps) {
	const anim = animationAttrs(animation);

	return (
		<BaseLabel
			{...rootAttrs}
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		>
			{text}
		</BaseLabel>
	);
}
