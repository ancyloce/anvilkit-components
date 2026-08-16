import { cn } from "@anvilkit/ui/lib/utils";
import { Textarea as BaseTextarea } from "@anvilkit/ui/textarea";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface TextareaProps {
	placeholder?: string;
	defaultValue?: string;
	disabled?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface TextareaViewProps extends TextareaProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
}

/**
 * Bare `@anvilkit/ui` textarea (DOC-01 §5.7). The upstream control
 * auto-sizes via `field-sizing-content`, so there is deliberately no
 * `rows` field — height is authored through the appearance carrier.
 *
 * `editMode` renders the control inert per DOC-01 §3.7 using the
 * package-wide `disabled || editMode` precedent.
 */
export function Textarea({
	placeholder,
	defaultValue,
	disabled = false,
	editMode = false,
	classNames,
	animation,
	rootAttrs,
}: TextareaViewProps) {
	const isInactive = disabled || editMode;
	const anim = animationAttrs(animation);

	return (
		<BaseTextarea
			{...rootAttrs}
			placeholder={placeholder}
			defaultValue={defaultValue}
			disabled={isInactive}
			readOnly={editMode}
			aria-disabled={isInactive || undefined}
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		/>
	);
}
