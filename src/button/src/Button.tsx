"use client";

import { useComponentTrack } from "@anvilkit/analytics-react";
import { Button as BaseButton, buttonVariants } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";
import {
	type Size,
	type Variant,
	variantOptions,
} from "./generated/fields.gen";

/**
 * Optional analytics properties sent with the click event (F13). Declared as a
 * type alias (not an interface) so it satisfies the helper's
 * `Record<string, string | undefined>` index signature.
 */
export type ButtonEventProps = {
	category?: string;
	placement?: string;
};

/** Full shadcn `buttonVariants` vocabulary, derived from the vendored
 * `@anvilkit/ui` source by `scripts/derive-shadcn-fields.mjs` and guarded by
 * `check:fields-drift` (PRD 0022 FR-003, PLAN-0036 P1-03). */
export type ButtonSystemVariant = Variant;

/** Curated per DOC-01 §5.1: the four `icon*` sizes are excluded until an
 * icon field exists (icon-only size with no icon renders an empty box).
 * The curation lives in the codegen manifest, so the full upstream union
 * still trips the drift gate. */
export type ButtonSize = Size;

export interface ButtonProps {
	label: string;
	/**
	 * Presentation preset (PRD 0022 FR-002, additive): `"marketing"`
	 * (default) keeps the original pill render byte-identical;
	 * `"system"` renders pure shadcn `buttonVariants` with the full
	 * variant/size unions.
	 */
	preset?: "marketing" | "system";
	variant?: "primary" | "secondary" | ButtonSystemVariant;
	/** shadcn size — honored only under the `"system"` preset. */
	size?: ButtonSize;
	disabled?: boolean;
	href?: string;
	openInNewTab?: boolean;
	/** Fire an analytics event on click (F13). Default off — render unchanged. */
	trackClick?: boolean;
	/** Event name; defaults to `button_click`. */
	eventName?: string;
	/** Extra properties merged into the click event. */
	eventProps?: ButtonEventProps;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface ButtonViewProps extends ButtonProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 target attributes stamped on the root element by the
	 * config adapter (serializable string map). The view never converts
	 * authored appearance into inline styles.
	 */
	rootAttrs?: Record<string, string>;
}

const SYSTEM_VARIANTS: readonly ButtonSystemVariant[] = variantOptions;

const baseClassName = "h-11 rounded-full px-5 shadow-sm";

const inactiveClassName = "cursor-not-allowed opacity-50";

function resolveVariant(
	preset: NonNullable<ButtonViewProps["preset"]>,
	variant: NonNullable<ButtonViewProps["variant"]>,
) {
	if (preset === "system") {
		return SYSTEM_VARIANTS.includes(variant as ButtonSystemVariant)
			? (variant as ButtonSystemVariant)
			: "default";
	}
	// Marketing mapping, unchanged: primary → default, secondary → outline.
	return variant === "secondary" ? "outline" : "default";
}

export function Button({
	label,
	preset = "marketing",
	variant = "primary",
	size,
	disabled = false,
	href,
	openInNewTab = false,
	editMode = false,
	trackClick = false,
	eventName,
	eventProps,
	classNames,
	animation,
	rootAttrs,
}: ButtonViewProps) {
	const isInactive = disabled || editMode;
	const resolvedHref = isInactive ? undefined : href;
	const isSystem = preset === "system";
	const resolvedVariant = resolveVariant(preset, variant);
	const resolvedSize = isSystem ? (size ?? "default") : "lg";
	const anim = animationAttrs(animation);

	// F13: context-only tracking — no-op without trackClick or a provider, and
	// never wired while inactive. Attached only when enabled so the default
	// render stays byte-identical.
	const fireTrack = useComponentTrack("button", {
		trackClick,
		eventName,
		eventProps,
	});
	const onClick = trackClick && !isInactive ? fireTrack : undefined;

	if (href) {
		return (
			<a
				{...rootAttrs}
				href={resolvedHref}
				target={resolvedHref && openInNewTab ? "_blank" : undefined}
				rel="noreferrer noopener"
				aria-disabled={isInactive || undefined}
				tabIndex={isInactive ? -1 : undefined}
				onClick={onClick}
				// §2.2: authored classes merge AFTER base classes so they win.
				className={cn(
					buttonVariants({ size: resolvedSize, variant: resolvedVariant }),
					!isSystem && baseClassName,
					isInactive && inactiveClassName,
					anim.className,
					classNames?.root,
				)}
				style={anim.style}
			>
				{label}
			</a>
		);
	}

	return (
		<BaseButton
			{...rootAttrs}
			variant={resolvedVariant}
			size={resolvedSize}
			disabled={isInactive}
			aria-disabled={isInactive || undefined}
			onClick={onClick}
			className={cn(
				!isSystem && baseClassName,
				isInactive && inactiveClassName,
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			{label}
		</BaseButton>
	);
}
