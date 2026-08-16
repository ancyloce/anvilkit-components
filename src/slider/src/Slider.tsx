import { cn } from "@anvilkit/ui/lib/utils";
import { Slider as BaseSlider } from "@anvilkit/ui/slider";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface SliderProps {
	defaultValue?: number;
	min?: number;
	max?: number;
	/** base-ui `Slider.Root` step (verified DOC-01 OPEN-2). */
	step?: number;
	disabled?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface SliderViewProps extends SliderProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
}

/**
 * Single-thumb `@anvilkit/ui` slider (DOC-01 §5.11).
 *
 * The upstream source falls back to a TWO-thumb range `[min, max]` when
 * no value is supplied (`slider.tsx:13-17`), so this wrapper always
 * passes a single-element `defaultValue` array to force one thumb.
 * Range mode is excluded in v1.
 *
 * `editMode` renders the control inert per DOC-01 §3.7.
 */
export function Slider({
	defaultValue = 50,
	min = 0,
	max = 100,
	step = 1,
	disabled = false,
	editMode = false,
	classNames,
	animation,
	rootAttrs,
}: SliderViewProps) {
	const isInactive = disabled || editMode;
	const anim = animationAttrs(animation);
	// Authors can drive `defaultValue` outside [min, max] through the
	// number field; clamp at render so the thumb is always on the track.
	const clamped = Math.min(Math.max(defaultValue, min), max);

	return (
		<BaseSlider
			{...rootAttrs}
			defaultValue={[clamped]}
			min={min}
			max={max}
			step={step}
			disabled={isInactive}
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		/>
	);
}
