import type { BentoGridItem } from "./types";

type ClassNameValue = false | null | string | undefined;

export function cn(...values: ClassNameValue[]) {
	return values.filter(Boolean).join(" ");
}

export function getItemKey(item: BentoGridItem) {
	return [item.icon, item.title, item.ctaHref, item.ctaLabel]
		.filter(Boolean)
		.join("-");
}
