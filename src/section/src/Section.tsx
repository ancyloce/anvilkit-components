import { AnimatedShinyText } from "@anvilkit/ui/animated-shiny-text";
import { AuroraText } from "@anvilkit/ui/aurora-text";
import { cn } from "@anvilkit/ui/lib/utils";

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
	editMode = false,
}: SectionViewProps) {
	const badgeContainerClassName = cn(
		"group rounded-full border border-black/5 bg-neutral-100 transition-all ease-in dark:border-white/5 dark:bg-neutral-900",
		!editMode && "hover:cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800",
	);

	return (
		<div className="h-full w-full border-b p-12">
			<div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-2">
				<div className="flex flex-col items-center justify-center">
					<div className="z-10 flex items-center justify-center">
						<div className={badgeContainerClassName}>
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

					<div className="mt-4 flex flex-col items-center justify-center gap-4">
						<h2 className="text-balance text-center text-2xl leading-[0.92] font-medium tracking-[-0.06em] md:text-3xl lg:text-6xl">
							{headline}{" "}
							<AuroraText
								className="max-w-[9.75ch] whitespace-normal align-baseline text-balance"
								colors={["var(--color-4)", "var(--color-3)", "var(--color-4)"]}
							>
								{highlightedHeadline}
							</AuroraText>
						</h2>
						<p className="mx-auto max-w-[30rem] text-balance text-center leading-[1.45] text-muted-foreground md:max-w-[34rem] md:text-lg">
							{description}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
