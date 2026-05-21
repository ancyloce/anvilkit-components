import { Button as BaseButton, buttonVariants } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";

export interface ButtonProps {
	label: string;
	variant?: "primary" | "secondary";
	disabled?: boolean;
	href?: string;
	openInNewTab?: boolean;
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
}: ButtonViewProps) {
	const isInactive = disabled || editMode;
	const resolvedHref = isInactive ? undefined : href;
	const resolvedVariant = getVariant(variant);

	if (href) {
		return (
			<a
				href={resolvedHref}
				target={resolvedHref && openInNewTab ? "_blank" : undefined}
				rel={resolvedHref && openInNewTab ? "noreferrer noopener" : undefined}
				aria-disabled={isInactive || undefined}
				tabIndex={isInactive ? -1 : undefined}
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
			className={cn(baseClassName, isInactive && inactiveClassName)}
		>
			{label}
		</BaseButton>
	);
}
