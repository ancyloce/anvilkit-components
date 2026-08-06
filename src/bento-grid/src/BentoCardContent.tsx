import { platformContentClassNames } from "./constants";
import { IconBadge } from "./IconBadge";
import { ItemCallToAction } from "./ItemCallToAction";
import type { BentoGridItem, BentoGridPlatform } from "./types";
import { cn } from "./utils";

export function BentoCardContent({
	item,
	editMode,
	platform,
	classNames,
	targetAttrs,
}: {
	item: BentoGridItem;
	editMode: boolean;
	platform: BentoGridPlatform;
	/** §2.2 authored classes, keyed by style-target id (PLAN-0027). */
	classNames?: Record<string, string>;
	/** §6.2 named-target attributes keyed by target id. */
	targetAttrs?: Record<string, Record<string, string>>;
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
				<IconBadge
					icon={item.icon}
					background={background}
					attrs={targetAttrs?.cardIcon}
					className={classNames?.cardIcon}
				/>
			</div>
			<div className="space-y-[1.15rem]">
				<h2
					{...targetAttrs?.cardTitle}
					className={cn(
						"text-balance text-[2rem] leading-[1.08] font-semibold tracking-[-0.05em] text-card-foreground sm:text-[2.15rem]",
						classNames?.cardTitle,
					)}
				>
					{item.title}
				</h2>
				<p
					{...targetAttrs?.cardDescription}
					className={cn(
						"max-w-[17.5rem] text-[1.08rem] leading-[1.45] text-muted-foreground",
						platformContent.copy,
						classNames?.cardDescription,
					)}
				>
					{item.description}
				</p>
			</div>
			<div className="pt-0.5">
				<ItemCallToAction
					item={item}
					editMode={editMode}
					attrs={targetAttrs?.cardCta}
					className={classNames?.cardCta}
				/>
			</div>
		</div>
	);
}
