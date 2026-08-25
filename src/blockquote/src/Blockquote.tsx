import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface BlockquoteProps {
	quote: string;
	citation?: string;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface BlockquoteViewProps extends BlockquoteProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`quote`, `citation`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

export function Blockquote({
	quote,
	citation,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: BlockquoteViewProps) {
	const anim = animationAttrs(animation);

	return (
		<figure
			{...rootAttrs}
			className={cn(
				"border-l-4 border-primary/40 pl-5 text-foreground",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<blockquote
				{...targetAttrs?.quote}
				className={cn("text-lg leading-8 italic sm:text-xl", classNames?.quote)}
			>
				“{quote}”
			</blockquote>
			{citation ? (
				<figcaption
					{...targetAttrs?.citation}
					className={cn(
						"mt-3 text-sm text-muted-foreground",
						classNames?.citation,
					)}
				>
					— {citation}
				</figcaption>
			) : null}
		</figure>
	);
}
