import { Checkbox as BaseCheckbox } from "@anvilkit/ui/checkbox";
import { Label as BaseLabel } from "@anvilkit/ui/label";
import { cn } from "@anvilkit/ui/lib/utils";
import { useId } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface CheckboxProps {
	label?: string;
	/** base-ui `Checkbox.Root` uncontrolled initial state (verified DOC-01 OPEN-2). */
	defaultChecked?: boolean;
	disabled?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface CheckboxViewProps extends CheckboxProps {
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
 * `@anvilkit/ui` checkbox paired with its own label (DOC-01 §5.9). The
 * upstream primitive is a bare box with no label of its own, so this
 * wrapper owns the flex row and the `id`/`htmlFor` pairing — generated
 * at render time with `useId`, never a prop (§3.6 bans cross-node
 * reference props).
 *
 * `editMode` renders the control inert per DOC-01 §3.7.
 */
export function Checkbox({
	label,
	defaultChecked = false,
	disabled = false,
	editMode = false,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: CheckboxViewProps) {
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
			<BaseCheckbox
				{...targetAttrs?.control}
				id={controlId}
				defaultChecked={defaultChecked}
				disabled={isInactive}
				className={classNames?.control}
			/>
			{/* §5.9: an empty label renders no element at all. The `label`
			    target is therefore conditional on content — the parity suite
			    compares defaults, where it is always present. */}
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
