import { AnimatedShinyText } from "@anvilkit/ui/animated-shiny-text";
import { AuroraText } from "@anvilkit/ui/aurora-text";

export interface SectionProps {
	badgeLabel: string;
	headline: string;
	highlightedHeadline: string;
	description: string;
}

export interface SectionViewProps extends SectionProps {
	editMode?: boolean;
}

export function Section({
	badgeLabel,
	headline,
	highlightedHeadline,
	description,
}: SectionViewProps) {
	return (
		<div className="border-b w-full h-full p-12">
			<div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-2">
				<div className="flex flex-col items-center justify-center">
					<div className="z-10 flex items-center justify-center">
						<div className="group rounded-full border border-black/5 bg-neutral-100 transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800">
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
						<h2 className="text-2xl md:text-3xl lg:text-6xl leading-[0.92] font-medium tracking-[-0.06em] text-center text-balance">
							{headline}{" "}
							<AuroraText
								className="max-w-[9.75ch] whitespace-normal align-baseline text-balance"
								colors={["var(--color-4)", "var(--color-3)", "var(--color-4)"]}
							>
								{highlightedHeadline}
							</AuroraText>
						</h2>
						<p className="max-w-[30rem] mx-auto text-center text-balance text-muted-foreground leading-[1.45] md:max-w-[34rem] md:text-lg">
							{description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
