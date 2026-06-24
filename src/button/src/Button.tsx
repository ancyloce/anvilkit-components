"use client";

import { useComponentTrack } from "@anvilkit/analytics-react";
import { Button as BaseButton, buttonVariants } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";

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
}

export interface ButtonViewProps extends ButtonProps {
	editMode?: boolean;
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
}: ButtonViewProps) {
	const isInactive = disabled || editMode;
	const resolvedHref = isInactive ? undefined : href;
	const resolvedVariant = getVariant(variant);

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
				href={resolvedHref}
				target={resolvedHref && openInNewTab ? "_blank" : undefined}
				rel={resolvedHref && openInNewTab ? "noreferrer noopener" : undefined}
				aria-disabled={isInactive || undefined}
				tabIndex={isInactive ? -1 : undefined}
				onClick={onClick}
				className={cn(
					buttonVariants({ size: "lg", variant: resolvedVariant }),
					baseClassName,
					isInactive && inactiveClassName,
				)}
			>
				{label}
			</a>
		);
	}

	return (
		<BaseButton
			variant={resolvedVariant}
			size="lg"
			disabled={isInactive}
			aria-disabled={isInactive || undefined}
			onClick={onClick}
			className={cn(baseClassName, isInactive && inactiveClassName)}
		>
			{label}
		</BaseButton>
	);
}
