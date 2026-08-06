import { iconMap } from "./constants";
import type { BentoGridIcon } from "./types";
import { cn } from "./utils";

export function IconBadge({
	icon,
	background,
	attrs,
	className,
}: {
	icon: BentoGridIcon;
	background: boolean;
	/** §6.2 `cardIcon` target attributes, stamped by the config adapter. */
	attrs?: Record<string, string>;
	/** §2.2 authored classes, merged AFTER base classes. */
	className?: string;
}) {
	const Icon = iconMap[icon];

	return (
		<div
			{...attrs}
			className={cn(
				"flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[0.85rem] sm:h-[3.35rem] sm:w-[3.35rem]",
				background
					? "bg-primary text-primary-foreground"
					: "bg-primary/15 text-primary",
				className,
			)}
		>
			<Icon aria-hidden="true" className="h-6 w-6" />
		</div>
	);
}
