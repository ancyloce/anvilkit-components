import { BentoCard } from "./BentoCard";
import { BentoCardContent } from "./BentoCardContent";
import {
	platformContainerClassNames,
	platformGridClassNames,
	themeClassNames,
} from "./constants";
import type { BentoGridViewProps } from "./types";
import { cn, getItemKey } from "./utils";

const EMPTY_BENTO_GRID_ITEMS: NonNullable<BentoGridViewProps["items"]> = [];

export function BentoGrid({
	items = EMPTY_BENTO_GRID_ITEMS,
	children,
	className,
	platform = "adaptive",
	theme = "dark",
	editMode = false,
}: BentoGridViewProps) {
	return (
		<section
			className={cn(
				"anvilkit-bento-grid relative isolate mx-auto w-full overflow-hidden rounded-none !border-0 !bg-[var(--bento-theme-background)] !shadow-none",
				platformContainerClassNames[platform],
				themeClassNames[theme],
				className,
			)}
			data-platform={platform}
			data-theme={theme}
		>
			<div className="anvilkit-bento-grid__theme relative !p-0">
				<div
					className={cn(
						"grid auto-rows-fr gap-px bg-border",
						platformGridClassNames[platform],
					)}
				>
					{children ??
						items.map((item) => (
							<BentoCard
								key={getItemKey(item)}
								size={item.size}
								rounded={item.rounded}
								background={item.background}
							>
								<BentoCardContent
									item={item}
									editMode={editMode}
									platform={platform}
								/>
							</BentoCard>
						))}
				</div>
			</div>
		</section>
	);
}
