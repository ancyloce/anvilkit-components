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
}: InputViewProps) {
	const isDisabled = disabled || editMode;

	return (
		<label className="grid max-w-md gap-2 text-foreground">
			<span className="text-sm font-semibold">
				{label}
				{required ? " *" : ""}
			</span>
			<BaseInput
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
