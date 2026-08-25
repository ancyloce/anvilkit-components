import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

export type TextVariant = "default" | "lead" | "muted" | "small";
export type TextAlignment = "left" | "center" | "right";

export interface TextProps {
	text: string;
	variant?: TextVariant;
	alignment?: TextAlignment;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface TextViewProps extends TextProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
}

const alignmentClasses: Record<TextAlignment, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

const variantClasses: Record<TextVariant, string> = {
	default: "text-base leading-7 text-foreground",
	lead: "text-lg leading-8 text-muted-foreground sm:text-xl",
	muted: "text-sm leading-6 text-muted-foreground",
	small: "text-xs leading-5 text-foreground",
};

export function Text({
	text,
	variant = "default",
	alignment = "left",
	classNames,
	animation,
	rootAttrs,
}: TextViewProps) {
	const anim = animationAttrs(animation);

	return (
		<p
			{...rootAttrs}
			className={cn(
				"whitespace-pre-line",
				variantClasses[variant],
				alignmentClasses[alignment],
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			{text}
		</p>
	);
}
