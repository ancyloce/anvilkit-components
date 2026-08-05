import { Input as BaseInput } from "@anvilkit/ui/input";
import { cn } from "@anvilkit/ui/lib/utils";

export interface InputProps {
	label: string;
	name: string;
	type?: "text" | "email" | "password" | "search" | "tel" | "url";
	placeholder?: string;
	helperText?: string;
	defaultValue?: string;
	required?: boolean;
	disabled?: boolean;
}

export interface InputViewProps extends InputProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * (serializable). The view never converts authored appearance into
	 * inline styles.
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`control`, `label`). */
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
	editMode = false,
	rootAttrs,
	targetAttrs,
}: InputViewProps) {
	const isDisabled = disabled || editMode;

	return (
		<label {...rootAttrs} className="grid max-w-md gap-2 text-foreground">
			<span {...targetAttrs?.label} className="text-sm font-semibold">
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
				)}
			/>
			{helperText ? (
				<span className="text-sm leading-6 text-muted-foreground">
					{helperText}
				</span>
			) : null}
		</label>
	);
}
