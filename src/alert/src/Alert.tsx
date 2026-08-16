import {
	AlertDescription,
	AlertTitle,
	Alert as BaseAlert,
} from "@anvilkit/ui/alert";
import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";
import type { Variant } from "./generated/fields.gen";

export interface AlertProps {
	/** Exact cva axis from `@anvilkit/ui` `alertVariants` (DOC-01 §5.14). */
	variant?: Variant;
	title: string;
	description?: string;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface AlertViewProps extends AlertProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`title`, `description`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

/**
 * `@anvilkit/ui` alert (DOC-01 §5.14). `AlertAction` and the leading
 * icon are excluded in v1 (OPEN-3: there is no icon field type yet, and
 * the action region is a candidate future slot).
 *
 * Non-interactive — nothing to make inert for `editMode`.
 */
export function Alert({
	variant = "default",
	title,
	description,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: AlertViewProps) {
	const anim = animationAttrs(animation);

	return (
		<BaseAlert
			{...rootAttrs}
			variant={variant}
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		>
			<AlertTitle {...targetAttrs?.title} className={classNames?.title}>
				{title}
			</AlertTitle>
			{/* §5.14: an empty description renders no element at all. */}
			{description ? (
				<AlertDescription
					{...targetAttrs?.description}
					className={classNames?.description}
				>
					{description}
				</AlertDescription>
			) : null}
		</BaseAlert>
	);
}
