import type { ComponentPropsWithoutRef, ReactNode } from "react";
import type {
	cardSizeClassNames,
	iconMap,
	platformContainerClassNames,
	themeClassNames,
} from "./constants";

export type BentoGridIcon = keyof typeof iconMap;
export type BentoCardSize = keyof typeof cardSizeClassNames;
export type BentoGridPlatform = keyof typeof platformContainerClassNames;
export type BentoGridTheme = keyof typeof themeClassNames;

export interface BentoGridItem {
	icon: BentoGridIcon;
	title: string;
	description: string;
	size?: BentoCardSize;
	rounded?: boolean;
	background?: boolean;
	ctaLabel?: string;
	ctaHref?: string;
	ctaOpenInNewTab?: boolean;
}

export interface BentoGridProps {
	items?: BentoGridItem[];
	children?: ReactNode;
	className?: string;
	platform?: BentoGridPlatform;
	theme?: BentoGridTheme;
}

export interface BentoGridViewProps extends BentoGridProps {
	editMode?: boolean;
	/**
	 * Editor-stamped root attributes (AnvilKit visual editor,
	 * `styleTarget: "root"`). Spread onto the root element; absent in
	 * normal rendering. Legacy v1 path — superseded by `rootAttrs`,
	 * retained until the v1 runtime is deleted (PLAN-0025 Phase 6).
	 */
	editorDataAttributes?: Readonly<Record<string, string>>;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`items`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

export interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
	size?: BentoCardSize;
	rounded?: boolean;
	background?: boolean;
	children: ReactNode;
}
