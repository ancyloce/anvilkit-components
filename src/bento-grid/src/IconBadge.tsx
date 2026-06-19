import { iconMap } from "./constants";
import type { BentoGridIcon } from "./types";
import { cn } from "./utils";

export function IconBadge({
	icon,
	background,
}: {
	icon: BentoGridIcon;
	background: boolean;
}) {
	const Icon = iconMap[icon];

	return (
		<div
			className={cn(
				"flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[0.85rem] sm:h-[3.35rem] sm:w-[3.35rem]",
				background
					? "bg-primary text-primary-foreground"
					: "bg-primary/15 text-primary",
			)}
		>
			<Icon aria-hidden="true" className="h-6 w-6" />
		</div>
	);
}
