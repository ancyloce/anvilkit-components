import { Input as BaseInput } from "@anvilkit/ui/input";
import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface InputProps {
	label: string;
	name: string;
	type?: "text" | "email" | "password" | "search" | "tel" | "url";
	placeholder?: string;
	helperText?: string;
	defaultValue?: string;
	required?: boolean;
	disabled?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface InputViewProps extends InputProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * (serializable). The view never converts authored appearance into
	 * inline styles.
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`control`, `label`, `helperText`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

export function Input({
	label,
	name,
	type = "text",
	placeholder,
	helperText,
	defaultValue,
	required = false,
	disabled = false,
	classNames,
	animation,
	editMode = false,
	rootAttrs,
	targetAttrs,
}: InputViewProps) {
	const isDisabled = disabled || editMode;
	const anim = animationAttrs(animation);

	return (
		<label
			{...rootAttrs}
			className={cn(
				"grid max-w-md gap-2 text-foreground",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<span
				{...targetAttrs?.label}
				className={cn("text-sm font-semibold", classNames?.label)}
			>
				{label}
				{required ? " *" : ""}
			</span>
			<BaseInput
				{...targetAttrs?.control}
				type={type}
				name={name}
				defaultValue={defaultValue}
				placeholder={placeholder}
				disabled={isDisabled}
				readOnly={editMode}
				required={required}
				aria-disabled={isDisabled || undefined}
				className={cn(
					"h-11 min-w-[16rem] rounded-2xl px-4 text-sm shadow-sm",
					isDisabled && "bg-input/50 text-muted-foreground",
					classNames?.control,
				)}
			/>
			{helperText ? (
				<span
					{...targetAttrs?.helperText}
					className={cn(
						"text-sm leading-6 text-muted-foreground",
						classNames?.helperText,
					)}
				>
					{helperText}
				</span>
			) : null}
		</label>
	);
}
