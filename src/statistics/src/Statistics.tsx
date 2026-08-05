import { FlickeringGrid } from "@anvilkit/ui/flickering-grid";

/** A single metric row (label + value). Serializable. */
export interface StatisticsMetric {
	label: string;
	value: string;
}

export interface StatisticsProps {
	title: string;
	/**
	 * Where `metrics` come from: author-entered (`static`) or resolved
	 * server-side by the F11 `dataSource` adapter (`remote_csv`). The component
	 * never fetches — it only renders the resolved `metrics` prop.
	 */
	dataSource?: "static" | "remote_csv";
	metrics?: StatisticsMetric[];
}

export interface StatisticsViewProps extends StatisticsProps {
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	editMode?: boolean;
}

export function Statistics({ title, rootAttrs }: StatisticsViewProps) {
	return (
		<section {...rootAttrs} className="w-full">
			<div className="relative isolate mx-auto w-full overflow-hidden bg-background px-2 py-8 text-center md:px-12 md:py-12">
				<h2 className="text-balance text-md font-semibold tracking-[0.26em] text-muted-foreground uppercase">
					{title}
				</h2>

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
