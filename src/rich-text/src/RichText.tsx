import { cn } from "@anvilkit/ui/lib/utils";
import type { RichText } from "@puckeditor/core";
import { type AnimationProps, animationAttrs } from "./authoring";

export type RichTextAlignment = "left" | "center" | "right";

export interface RichTextProps {
	content: RichText;
	alignment?: RichTextAlignment;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface RichTextViewProps extends RichTextProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
}

const alignmentClasses: Record<RichTextAlignment, string> = {
	left: "text-left",
	center: "text-center",
	right: "text-right",
};

export function RichText({
	content,
	alignment = "left",
	classNames,
	animation,
	rootAttrs,
}: RichTextViewProps) {
	const anim = animationAttrs(animation);

	return (
		<div
			{...rootAttrs}
			className={cn(
				"max-w-none text-base leading-7 text-foreground",
				"[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
				"[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic",
				"[&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight",
				"[&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight",
				"[&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold",
				"[&_li]:ml-6 [&_li]:list-item [&_ol]:my-4 [&_ol]:list-decimal [&_p:not(:first-child)]:mt-4 [&_ul]:my-4 [&_ul]:list-disc",
				alignmentClasses[alignment],
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			{content}
		</div>
	);
}
