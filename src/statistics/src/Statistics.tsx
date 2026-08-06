import { FlickeringGrid } from "@anvilkit/ui/flickering-grid";
import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

/** A single metric row (label + value). Serializable. */
export interface StatisticsMetric {
	label: string;
	value: string;
}

export interface StatisticsProps {
	title: string;
	metrics?: StatisticsMetric[];
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface StatisticsViewProps extends StatisticsProps {
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`title`, `item`, …). */
	targetAttrs?: Record<string, Record<string, string>>;
	editMode?: boolean;
}

export function Statistics({
	title,
	metrics = [],
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: StatisticsViewProps) {
	const anim = animationAttrs(animation);

	return (
		<section
			{...rootAttrs}
			className={cn("w-full", anim.className, classNames?.root)}
			style={anim.style}
		>
			<div className="relative isolate mx-auto w-full overflow-hidden bg-background px-2 py-8 text-center md:px-12 md:py-12">
				<h2
					{...targetAttrs?.title}
					className={cn(
						"text-balance text-md font-semibold tracking-[0.26em] text-muted-foreground uppercase",
						classNames?.title,
					)}
				>
					{title}
				</h2>

				{metrics.length > 0 ? (
					<div className="mx-auto mt-8 grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
						{metrics.map((metric) => (
							<div
								key={`${metric.label}-${metric.value}`}
								{...targetAttrs?.item}
								className={cn(
									"flex flex-col items-center gap-1 p-3",
									classNames?.item,
								)}
							>
								<span
									{...targetAttrs?.value}
									className={cn(
										"text-3xl font-semibold text-foreground md:text-4xl",
										classNames?.value,
									)}
								>
									{metric.value}
								</span>
								<span
									{...targetAttrs?.label}
									className={cn(
										"text-xs tracking-wide text-muted-foreground uppercase",
										classNames?.label,
									)}
								>
									{metric.label}
								</span>
							</div>
						))}
					</div>
				) : null}

				<div className="pointer-events-none absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-t from-background dark:from-background -z-10 from-50%"></div>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-20 size-full"
				>
					<FlickeringGrid
						className="size-full"
						color="var(--statistics-grid-color)"
						flickerChance={0.18}
						gridGap={6}
						maxOpacity={0.14}
						squareSize={4}
					/>
				</div>
			</div>
		</section>
	);
}
