import { Label as BaseLabel } from "@anvilkit/ui/label";
import { cn } from "@anvilkit/ui/lib/utils";
import { Switch as BaseSwitch } from "@anvilkit/ui/switch";
import { useId } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";
import type { Size } from "./generated/fields.gen";

export interface SwitchProps {
	label?: string;
	/** base-ui `Switch.Root` uncontrolled initial state (verified DOC-01 OPEN-2). */
	defaultChecked?: boolean;
	/** shadcn size axis, derived by `scripts/derive-shadcn-fields.mjs`. */
	size?: Size;
	disabled?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface SwitchViewProps extends SwitchProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`control`, `label`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

/**
 * `@anvilkit/ui` switch paired with its own label (DOC-01 §5.10). Like
 * the checkbox wrapper, the upstream primitive carries no label, so the
 * flex row and the `id`/`htmlFor` pairing live here — generated at
 * render time with `useId`, never a prop (§3.6).
 *
 * `editMode` renders the control inert per DOC-01 §3.7.
 */
export function Switch({
	label,
	defaultChecked = false,
	size = "default",
	disabled = false,
	editMode = false,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: SwitchViewProps) {
	const controlId = useId();
	const isInactive = disabled || editMode;
	const anim = animationAttrs(animation);

	return (
		<div
			{...rootAttrs}
			className={cn(
				"flex items-center gap-2",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<BaseSwitch
				{...targetAttrs?.control}
				id={controlId}
				defaultChecked={defaultChecked}
				size={size}
				disabled={isInactive}
				className={classNames?.control}
			/>
			{/* §5.10: an empty label renders no element at all. */}
			{label ? (
				<BaseLabel
					{...targetAttrs?.label}
					htmlFor={controlId}
					className={classNames?.label}
				>
					{label}
				</BaseLabel>
			) : null}
		</div>
	);
}
