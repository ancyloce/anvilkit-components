import { cn } from "@anvilkit/ui/lib/utils";
import {
	Select as BaseSelect,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@anvilkit/ui/select";
import { type AnimationProps, animationAttrs } from "./authoring";
import type { TriggerSize } from "./generated/fields.gen";

export interface SelectOption {
	label: string;
	value: string;
}

export interface SelectProps {
	options: SelectOption[];
	placeholder?: string;
	defaultValue?: string;
	/** shadcn trigger size axis (`SelectTrigger` `size`, DOC-01 §5.5), derived
	 * by `scripts/derive-shadcn-fields.mjs` and guarded by `check:fields-drift`. */
	triggerSize?: TriggerSize;
	disabled?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface SelectViewProps extends SelectProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 target attributes stamped on the trigger — the only
	 * always-rendered element this component owns (serializable string
	 * map). The view never converts authored appearance into inline styles.
	 */
	rootAttrs?: Record<string, string>;
}

/**
 * base-ui's `Select.Root` is a context provider, not DOM: the first real
 * element is the trigger, which is therefore this component's single `root` style target
 * (PLAN-0027 §2.1 real-DOM rule; DOC-01 §5.5). Popup content is portal'd
 * into the canvas iframe document and is deliberately not a target in v1
 * (DOC-01 §3.9).
 *
 * `editMode` renders the control inert per DOC-01 §3.7 — base-ui's
 * `disabled` both blocks interaction and keeps the popup from ever
 * opening inside the canvas.
 */
export function Select({
	options,
	placeholder = "Select…",
	defaultValue = "",
	triggerSize = "default",
	disabled = false,
	classNames,
	animation,
	editMode = false,
	rootAttrs,
}: SelectViewProps) {
	const anim = animationAttrs(animation);
	const isInactive = disabled || editMode;
	// base-ui resolves the selected label from `items`; an empty string is
	// "nothing selected", which is what drives the placeholder state.
	const hasDefault = options.some((option) => option.value === defaultValue);

	return (
		<BaseSelect
			items={options}
			defaultValue={hasDefault ? defaultValue : null}
			disabled={isInactive}
		>
			<SelectTrigger
				{...rootAttrs}
				size={triggerSize}
				aria-disabled={isInactive || undefined}
				// §2.2: authored classes merge AFTER base classes so they win.
				className={cn(anim.className, classNames?.root)}
				style={anim.style}
			>
				<SelectValue>
					{(value: unknown) =>
						value === null || value === undefined || value === ""
							? placeholder
							: (options.find((option) => option.value === value)?.label ??
								String(value))
					}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{options.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</BaseSelect>
	);
}
