import { type AnimationProps, animationAttrs } from "./authoring";

export type SpacerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpacerProps {
	size?: SpacerSize;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
}

export interface SpacerViewProps extends SpacerProps {
	editMode?: boolean;
	rootAttrs?: Record<string, string>;
}

const sizeClasses: Record<SpacerSize, string> = {
	xs: "h-4",
	sm: "h-8",
	md: "h-16",
	lg: "h-24",
	xl: "h-32",
};

function mergeClassNames(...classNames: (string | false | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

export function Spacer({
	size = "md",
	editMode = false,
	classNames,
	animation,
	rootAttrs,
}: SpacerViewProps) {
	const anim = animationAttrs(animation);

	return (
		<div
			{...rootAttrs}
			aria-hidden="true"
			className={mergeClassNames(
				"w-full shrink-0",
				sizeClasses[size],
				editMode && "border-y border-dashed border-primary/20 bg-primary/5",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		/>
	);
}
