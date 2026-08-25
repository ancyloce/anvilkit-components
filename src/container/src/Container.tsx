import type { Slot } from "@puckeditor/core";
import type { ReactNode } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";

export type ContainerMaxWidth = "sm" | "md" | "lg" | "xl" | "full";
export type ContainerPadding = "none" | "sm" | "md" | "lg";
export type ContainerAlignment = "start" | "center" | "end" | "stretch";

export interface ContainerProps {
	content: Slot;
	maxWidth?: ContainerMaxWidth;
	padding?: ContainerPadding;
	alignment?: ContainerAlignment;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
}

export interface ContainerViewProps {
	content: ReactNode;
	maxWidth?: ContainerMaxWidth;
	padding?: ContainerPadding;
	alignment?: ContainerAlignment;
	editMode?: boolean;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
	rootAttrs?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}

const maxWidthClasses: Record<ContainerMaxWidth, string> = {
	sm: "max-w-screen-sm",
	md: "max-w-screen-md",
	lg: "max-w-screen-lg",
	xl: "max-w-screen-xl",
	full: "max-w-none",
};

const paddingClasses: Record<ContainerPadding, string> = {
	none: "p-0",
	sm: "p-3 sm:p-4",
	md: "p-4 sm:p-6",
	lg: "p-6 sm:p-8",
};

const alignmentClasses: Record<ContainerAlignment, string> = {
	start: "me-auto",
	center: "mx-auto",
	end: "ms-auto",
	stretch: "",
};

function mergeClassNames(...classNames: (string | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

export function Container({
	content,
	maxWidth = "lg",
	padding = "md",
	alignment = "center",
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: ContainerViewProps) {
	const anim = animationAttrs(animation);

	return (
		<div
			{...rootAttrs}
			className={mergeClassNames(
				"w-full",
				maxWidthClasses[maxWidth],
				paddingClasses[padding],
				alignmentClasses[alignment],
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<div
				{...targetAttrs?.content}
				className={mergeClassNames("min-w-0", classNames?.content)}
			>
				{content}
			</div>
		</div>
	);
}
