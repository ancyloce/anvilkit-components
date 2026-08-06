import { animationAttrs } from "./authoring";
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
	classNames,
	animation,
	editMode = false,
	editorDataAttributes,
	rootAttrs,
	targetAttrs,
}: BentoGridViewProps) {
	const anim = animationAttrs(animation);

	return (
		<section
			{...editorDataAttributes}
			{...rootAttrs}
			className={cn(
				"anvilkit-bento-grid relative isolate mx-auto w-full overflow-hidden rounded-none !border-0 !bg-[var(--bento-theme-background)] !shadow-none",
				platformContainerClassNames[platform],
				themeClassNames[theme],
				className,
				anim.className,
				// §2.2 merge: authored classes come AFTER base classes.
				classNames?.root,
			)}
			style={anim.style}
			data-platform={platform}
			data-theme={theme}
		>
			<div className="anvilkit-bento-grid__theme relative !p-0">
				<div
					{...targetAttrs?.items}
					className={cn(
						"grid auto-rows-fr gap-px bg-border",
						platformGridClassNames[platform],
						classNames?.items,
					)}
				>
					{children ??
						items.map((item) => (
							<BentoCard
								key={getItemKey(item)}
								{...targetAttrs?.card}
								size={item.size}
								rounded={item.rounded}
								background={item.background}
								className={classNames?.card}
							>
								<BentoCardContent
									item={item}
									editMode={editMode}
									platform={platform}
									classNames={classNames}
									targetAttrs={targetAttrs}
								/>
							</BentoCard>
						))}
				</div>
			</div>
		</section>
	);
}
