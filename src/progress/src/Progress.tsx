import { cn } from "@anvilkit/ui/lib/utils";
import {
	Progress as BaseProgress,
	ProgressLabel,
	ProgressValue,
} from "@anvilkit/ui/progress";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface ProgressProps {
	value?: number;
	label?: string;
	showValue?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface ProgressViewProps extends ProgressProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
}

/**
 * `@anvilkit/ui` progress bar (DOC-01 §5.12). The upstream Root
 * auto-renders its Track + Indicator; the optional `ProgressLabel` and
 * `ProgressValue` parts render through `children`, so they are opt-in
 * here via the `label` and `showValue` fields.
 *
 * Non-interactive — nothing to make inert for `editMode`.
 */
export function Progress({
	value = 60,
	label,
	showValue = false,
	classNames,
	animation,
	rootAttrs,
}: ProgressViewProps) {
	const anim = animationAttrs(animation);
	// The bar is a 0–100 percentage; clamp so an out-of-range authored
	// value can never render a track wider than its container.
	const clamped = Math.min(Math.max(value, 0), 100);

	return (
		<BaseProgress
			{...rootAttrs}
			value={clamped}
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		>
			{label ? <ProgressLabel>{label}</ProgressLabel> : null}
			{showValue ? <ProgressValue /> : null}
		</BaseProgress>
	);
}
