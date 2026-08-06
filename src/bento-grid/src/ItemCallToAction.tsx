import type { BentoGridItem } from "./types";
import { cn } from "./utils";

export function ItemCallToAction({
	item,
	editMode,
	attrs,
	className,
}: {
	item: BentoGridItem;
	editMode: boolean;
	/** §6.2 `cardCta` target attributes, stamped in BOTH render branches. */
	attrs?: Record<string, string>;
	/** §2.2 authored classes, merged AFTER base classes. */
	className?: string;
}) {
	const label = item.ctaLabel || "Learn more >";
	const baseClassName =
		"text-[1.08rem] leading-none font-medium text-primary transition-opacity hover:opacity-85";

	if (!item.ctaHref || editMode) {
		return (
			<span
				{...attrs}
				aria-disabled="true"
				className={cn(
					baseClassName,
					"pointer-events-none opacity-70",
					className,
				)}
			>
				{label}
			</span>
		);
	}

	return (
		<a
			{...attrs}
			href={item.ctaHref}
			target={item.ctaOpenInNewTab ? "_blank" : undefined}
			rel={item.ctaOpenInNewTab ? "noreferrer noopener" : undefined}
			className={cn(baseClassName, className)}
		>
			{label}
		</a>
	);
}
