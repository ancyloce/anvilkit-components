import { AnimatedShinyText } from "@anvilkit/ui/animated-shiny-text";
import { AuroraText } from "@anvilkit/ui/aurora-text";
import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface SectionProps {
	badgeLabel: string;
	headline: string;
	highlightedHeadline: string;
	description: string;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface SectionViewProps extends SectionProps {
	editMode?: boolean;
	/**
	 * Editor-stamped root attributes (AnvilKit visual editor,
	 * `styleTarget: "root"`). Core passes these when authoring is
	 * enabled; spreading them onto the root element is what makes the
	 * component selectable/stylable without a wrapper node. Absent in
	 * normal rendering. Legacy v1 path — superseded by `rootAttrs`,
	 * retained until the v1 runtime is deleted (PLAN-0025 Phase 6).
	 */
	editorDataAttributes?: Readonly<Record<string, string>>;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025). Identical values to the v1 decoration
	 * when both are present, so the duplicate spread is a no-op.
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`content`, `badge`, …). */
	targetAttrs?: Record<string, Record<string, string>>;
}

export function Section({
	badgeLabel,
	headline,
	highlightedHeadline,
	description,
	classNames,
	animation,
	editorDataAttributes,
	rootAttrs,
	targetAttrs,
}: SectionViewProps) {
	const anim = animationAttrs(animation);

	return (
		<div
			{...editorDataAttributes}
			{...rootAttrs}
			className={cn(
				"border-b w-full h-full p-12",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<div
				{...targetAttrs?.content}
				className={cn(
					"w-full max-w-md mx-auto flex flex-col items-center justify-center gap-2",
					classNames?.content,
				)}
			>
				<div className="flex flex-col items-center justify-center">
					<div className="z-10 flex items-center justify-center">
						<div
							{...targetAttrs?.badge}
							className={cn(
								"group rounded-full border border-black/5 bg-neutral-100 transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
								classNames?.badge,
							)}
						>
							<div className="inline-flex items-center justify-center gap-2 px-4 py-1">
								<span
									aria-hidden="true"
									className="text-sm text-neutral-500 dark:text-neutral-400"
								>
									✨
								</span>
								<AnimatedShinyText
									shimmerWidth={72}
									className="mx-0 inline-block max-w-none whitespace-nowrap text-sm font-medium text-neutral-300/20"
								>
									{badgeLabel}
								</AnimatedShinyText>
							</div>
						</div>
					</div>

					<div className="flex flex-col items-center justify-center gap-4 mt-4">
						<h2
							{...targetAttrs?.headline}
							className={cn(
								"text-2xl md:text-3xl lg:text-6xl leading-[0.92] font-medium tracking-[-0.06em] text-center text-balance",
								classNames?.headline,
							)}
						>
							<span data-ak-text-target="headline">{headline}</span>{" "}
							<AuroraText
								className="max-w-[9.75ch] whitespace-normal align-baseline text-balance"
								colors={["var(--color-4)", "var(--color-3)", "var(--color-4)"]}
							>
								{highlightedHeadline}
							</AuroraText>
						</h2>
						<p
							{...targetAttrs?.description}
							data-ak-text-target="description"
							className={cn(
								"max-w-[30rem] mx-auto text-center text-balance text-muted-foreground leading-[1.45] md:max-w-[34rem] md:text-lg",
								classNames?.description,
							)}
						>
							{description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
