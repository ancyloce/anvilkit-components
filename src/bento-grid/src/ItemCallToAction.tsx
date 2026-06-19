import type { BentoGridItem } from "./types";
import { cn } from "./utils";

export function ItemCallToAction({
	item,
	editMode,
}: {
	item: BentoGridItem;
	editMode: boolean;
}) {
	const label = item.ctaLabel || "Learn more >";
	const className =
		"text-[1.08rem] leading-none font-medium text-primary transition-opacity hover:opacity-85";

	if (!item.ctaHref || editMode) {
		return (
			<span
				aria-disabled="true"
				className={cn(className, "pointer-events-none opacity-70")}
			>
				{label}
			</span>
		);
	}

	return (
		<a
			href={item.ctaHref}
			target={item.ctaOpenInNewTab ? "_blank" : undefined}
			rel={item.ctaOpenInNewTab ? "noreferrer noopener" : undefined}
			className={className}
		>
			{label}
		</a>
	);
}
