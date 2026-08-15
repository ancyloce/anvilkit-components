import {
	Card as BaseCard,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@anvilkit/ui/card";
import { cn } from "@anvilkit/ui/lib/utils";
import type { ReactNode } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface CardProps {
	title: string;
	description?: string;
	/** shadcn `Card` size axis (plain literal union, DOC-01 §5.3). */
	size?: "default" | "sm";
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface CardViewProps extends CardProps {
	/** Slot regions, already materialized by the config adapter. */
	content?: ReactNode;
	footer?: ReactNode;
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * (serializable). The view never converts authored appearance into
	 * inline styles.
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id. */
	targetAttrs?: Record<string, Record<string, string>>;
}

/**
 * Compound shadcn parts stay internal to the render — the document sees
 * only the named slots (design 0022 §3.3). The header collapses when both
 * `title` and `description` are empty; the two slot regions always render
 * so the editor, preview, publish and export consumers produce identical
 * DOM (Unified Puck Contract rule 3) and the regions stay droppable.
 */
export function Card({
	title,
	description,
	size = "default",
	content,
	footer,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: CardViewProps) {
	const anim = animationAttrs(animation);
	const hasHeader = Boolean(title || description);

	return (
		<BaseCard
			{...rootAttrs}
			size={size}
			// §2.2: authored classes merge AFTER base classes so they win.
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		>
			{hasHeader ? (
				<CardHeader>
					{title ? (
						<CardTitle {...targetAttrs?.title} className={classNames?.title}>
							{title}
						</CardTitle>
					) : null}
					{description ? (
						<CardDescription
							{...targetAttrs?.description}
							className={classNames?.description}
						>
							{description}
						</CardDescription>
					) : null}
				</CardHeader>
			) : null}
			<CardContent {...targetAttrs?.content} className={classNames?.content}>
				{content}
			</CardContent>
			<CardFooter {...targetAttrs?.footer} className={classNames?.footer}>
				{footer}
			</CardFooter>
		</BaseCard>
	);
}
