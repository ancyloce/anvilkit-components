import type { CSSProperties } from "react";

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

const baseStyle: CSSProperties = {
	alignItems: "center",
	borderRadius: "999px",
	borderStyle: "solid",
	borderWidth: "1px",
	display: "inline-flex",
	fontFamily: "inherit",
	fontSize: "0.95rem",
	fontWeight: 600,
	gap: "0.5rem",
	justifyContent: "center",
	lineHeight: 1.2,
	minHeight: "2.875rem",
	padding: "0.7rem 1.2rem",
	textDecoration: "none",
	transition:
		"background-color 120ms ease, border-color 120ms ease, color 120ms ease",
};

const variantStyles: Record<
	NonNullable<ButtonViewProps["variant"]>,
	CSSProperties
> = {
	primary: {
		backgroundColor: "#1f2937",
		borderColor: "#1f2937",
		color: "#f9fafb",
	},
	secondary: {
		backgroundColor: "#ffffff",
		borderColor: "#cbd5e1",
		color: "#0f172a",
	},
};

const disabledStyle: CSSProperties = {
	cursor: "not-allowed",
	opacity: 0.55,
};

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
	const style = {
		...baseStyle,
		...variantStyles[variant],
		cursor: isInactive ? "not-allowed" : "pointer",
		...(isInactive ? disabledStyle : {}),
	} satisfies CSSProperties;

	if (href) {
		return (
			<a
				href={resolvedHref}
				target={resolvedHref && openInNewTab ? "_blank" : undefined}
				rel={resolvedHref && openInNewTab ? "noreferrer noopener" : undefined}
				aria-disabled={isInactive || undefined}
				style={style}
			>
				{label}
			</a>
		);
	}

	return (
		<button
			type="button"
			disabled={isInactive}
			aria-disabled={isInactive || undefined}
			style={style}
		>
			{label}
		</button>
	);
}
