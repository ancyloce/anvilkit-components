import { IconBadge } from "./IconBadge";
import { ItemCallToAction } from "./ItemCallToAction";
import { platformContentClassNames } from "./constants";
import type { BentoGridItem, BentoGridPlatform } from "./types";
import { cn } from "./utils";

export function BentoCardContent({
	item,
	editMode,
	platform,
}: {
	item: BentoGridItem;
	editMode: boolean;
	platform: BentoGridPlatform;
}) {
	const background = item.background ?? true;
	const platformContent = platformContentClassNames[platform];

	return (
		<div
			className={cn(
				"mx-auto flex max-w-[21rem] flex-col items-center justify-center gap-6",
				platformContent.body,
			)}
		>
			<div className={cn("flex w-full", platformContent.icon)}>
				<IconBadge icon={item.icon} background={background} />
			</div>
			<div className="space-y-[1.15rem]">
				<h2 className="text-balance text-[2rem] leading-[1.08] font-semibold tracking-[-0.05em] text-card-foreground sm:text-[2.15rem]">
					{item.title}
				</h2>
				<p
					className={cn(
						"max-w-[17.5rem] text-[1.08rem] leading-[1.45] text-muted-foreground",
						platformContent.copy,
					)}
				>
					{item.description}
				</p>
			</div>
			<div className="pt-0.5">
				<ItemCallToAction item={item} editMode={editMode} />
			</div>
		</div>
	);
}
