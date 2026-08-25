import { type AnimationProps, animationAttrs } from "./authoring";

export type ImageAspectRatio = "auto" | "square" | "video" | "portrait";
export type ImageObjectFit = "cover" | "contain";

export interface ImageProps {
	src: string;
	alt: string;
	caption?: string;
	aspectRatio?: ImageAspectRatio;
	objectFit?: ImageObjectFit;
	loading?: "lazy" | "eager";
	classNames?: Record<string, string>;
	animation?: AnimationProps;
}

export interface ImageViewProps extends ImageProps {
	editMode?: boolean;
	rootAttrs?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}

const aspectClasses: Record<ImageAspectRatio, string> = {
	auto: "",
	square: "aspect-square overflow-hidden",
	video: "aspect-video overflow-hidden",
	portrait: "aspect-[3/4] overflow-hidden",
};

const fitClasses: Record<ImageObjectFit, string> = {
	cover: "object-cover",
	contain: "object-contain",
};

function mergeClassNames(...classNames: (string | false | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

export function Image({
	src,
	alt,
	caption,
	aspectRatio = "auto",
	objectFit = "cover",
	loading = "lazy",
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: ImageViewProps) {
	const anim = animationAttrs(animation);

	return (
		<figure
			{...rootAttrs}
			className={mergeClassNames(
				"m-0 grid gap-2",
				aspectClasses[aspectRatio],
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<img
				{...targetAttrs?.media}
				src={src}
				alt={alt}
				loading={loading}
				decoding="async"
				className={mergeClassNames(
					"h-full w-full max-w-full rounded-lg",
					aspectRatio === "auto" && "h-auto",
					fitClasses[objectFit],
					classNames?.media,
				)}
			/>
			{caption ? (
				<figcaption
					{...targetAttrs?.caption}
					className={mergeClassNames(
						"text-sm text-muted-foreground",
						classNames?.caption,
					)}
				>
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}
