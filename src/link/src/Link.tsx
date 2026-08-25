import { type AnimationProps, animationAttrs } from "./authoring";

export type LinkVariant = "default" | "muted" | "underline";
export type LinkSize = "sm" | "md" | "lg";

export interface LinkProps {
	text: string;
	href: string;
	openInNewTab?: boolean;
	variant?: LinkVariant;
	size?: LinkSize;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
}

export interface LinkViewProps extends LinkProps {
	editMode?: boolean;
	rootAttrs?: Record<string, string>;
}

const variantClasses: Record<LinkVariant, string> = {
	default: "font-medium text-primary hover:text-primary/80",
	muted: "text-muted-foreground hover:text-foreground",
	underline:
		"text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary",
};

const sizeClasses: Record<LinkSize, string> = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-lg",
};

function mergeClassNames(...classNames: (string | false | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

function safeHref(href: string): string | undefined {
	const value = href.trim();
	if (!value) return undefined;
	if (
		value.startsWith("/") ||
		value.startsWith("#") ||
		value.startsWith("./") ||
		value.startsWith("../")
	) {
		return value;
	}
	try {
		const url = new URL(value);
		return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
			? value
			: undefined;
	} catch {
		return undefined;
	}
}

export function Link({
	text,
	href,
	openInNewTab = false,
	variant = "default",
	size = "md",
	classNames,
	animation,
	editMode = false,
	rootAttrs,
}: LinkViewProps) {
	const anim = animationAttrs(animation);
	const resolvedHref = editMode ? undefined : safeHref(href);
	const disabled = !resolvedHref;

	return (
		<a
			{...rootAttrs}
			href={resolvedHref}
			target={resolvedHref && openInNewTab ? "_blank" : undefined}
			rel={resolvedHref && openInNewTab ? "noreferrer noopener" : undefined}
			aria-disabled={disabled || undefined}
			tabIndex={disabled ? -1 : undefined}
			className={mergeClassNames(
				"inline-flex items-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				variantClasses[variant],
				sizeClasses[size],
				disabled && "cursor-not-allowed opacity-50",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			{text}
		</a>
	);
}
