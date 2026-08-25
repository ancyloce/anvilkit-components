import { type AnimationProps, animationAttrs } from "./authoring";

export type IconName =
	| "sparkles"
	| "check"
	| "arrow-right"
	| "heart"
	| "star"
	| "circle";
export type IconSize = "sm" | "md" | "lg" | "xl";

export interface IconProps {
	name: IconName;
	size?: IconSize;
	strokeWidth?: 1 | 1.5 | 2 | 2.5;
	decorative?: boolean;
	label?: string;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
}

export interface IconViewProps extends IconProps {
	editMode?: boolean;
	rootAttrs?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}

const sizeClasses: Record<IconSize, string> = {
	sm: "size-4",
	md: "size-6",
	lg: "size-8",
	xl: "size-12",
};

function mergeClassNames(...classNames: (string | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

function Glyph({ name }: { name: IconName }) {
	switch (name) {
		case "check":
			return <path d="m5 12 4 4L19 6" />;
		case "arrow-right":
			return (
				<>
					<path d="M5 12h14" />
					<path d="m13 6 6 6-6 6" />
				</>
			);
		case "heart":
			return (
				<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
			);
		case "star":
			return (
				<path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z" />
			);
		case "circle":
			return <circle cx="12" cy="12" r="9" />;
		default:
			return (
				<>
					<path d="m12 3-1.1 3.3a4 4 0 0 1-2.6 2.6L5 10l3.3 1.1a4 4 0 0 1 2.6 2.6L12 17l1.1-3.3a4 4 0 0 1 2.6-2.6L19 10l-3.3-1.1a4 4 0 0 1-2.6-2.6L12 3Z" />
					<path d="m5 16-.6 1.7a2 2 0 0 1-1.1 1.1L2 19.5l1.3.6a2 2 0 0 1 1.1 1.1L5 23l.6-1.8a2 2 0 0 1 1.1-1.1l1.3-.6-1.3-.7a2 2 0 0 1-1.1-1.1L5 16Z" />
				</>
			);
	}
}

export function Icon({
	name,
	size = "md",
	strokeWidth = 2,
	decorative = true,
	label,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: IconViewProps) {
	const anim = animationAttrs(animation);
	const accessibleLabel = label || name.replace("-", " ");

	return (
		<span
			{...rootAttrs}
			className={mergeClassNames(
				"inline-flex shrink-0 items-center justify-center text-current",
				sizeClasses[size],
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<svg
				{...targetAttrs?.icon}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeLinejoin="round"
				role={decorative ? undefined : "img"}
				aria-hidden={decorative || undefined}
				aria-label={decorative ? undefined : accessibleLabel}
				className={mergeClassNames("size-full", classNames?.icon)}
			>
				<title>{accessibleLabel}</title>
				<Glyph name={name} />
			</svg>
		</span>
	);
}
