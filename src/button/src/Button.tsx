"use client";

import { useComponentTrack } from "@anvilkit/analytics-react";
import { Button as BaseButton, buttonVariants } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";

/**
 * Optional analytics properties sent with the click event (F13). Declared as a
 * type alias (not an interface) so it satisfies the helper's
 * `Record<string, string | undefined>` index signature.
 */
export type ButtonEventProps = {
	category?: string;
	placement?: string;
};

export interface ButtonProps {
	label: string;
	variant?: "primary" | "secondary";
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

const variantMap = {
	primary: "default",
	secondary: "outline",
} as const;

const baseClassName = "h-11 rounded-full px-5 shadow-sm";

const inactiveClassName = "cursor-not-allowed opacity-50";

function getVariant(variant: NonNullable<ButtonViewProps["variant"]>) {
	return variantMap[variant];
}

export function Button({
	label,
	variant = "primary",
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
	const resolvedVariant = getVariant(variant);
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
					buttonVariants({ size: "lg", variant: resolvedVariant }),
					baseClassName,
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
			size="lg"
			disabled={isInactive}
			aria-disabled={isInactive || undefined}
			onClick={onClick}
			className={cn(
				baseClassName,
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
