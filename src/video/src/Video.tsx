import { type AnimationProps, animationAttrs } from "./authoring";

export type VideoAspectRatio = "video" | "square" | "portrait";

export interface VideoProps {
	src: string;
	title: string;
	poster?: string;
	caption?: string;
	captionsSrc?: string;
	aspectRatio?: VideoAspectRatio;
	controls?: boolean;
	autoPlay?: boolean;
	muted?: boolean;
	loop?: boolean;
	classNames?: Record<string, string>;
	animation?: AnimationProps;
}

export interface VideoViewProps extends VideoProps {
	editMode?: boolean;
	rootAttrs?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}

const aspectClasses: Record<VideoAspectRatio, string> = {
	video: "aspect-video",
	square: "aspect-square",
	portrait: "aspect-[3/4]",
};

function mergeClassNames(...classNames: (string | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

export function Video({
	src,
	title,
	poster,
	caption,
	captionsSrc,
	aspectRatio = "video",
	controls = true,
	autoPlay = false,
	muted = true,
	loop = false,
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: VideoViewProps) {
	const anim = animationAttrs(animation);

	return (
		<figure
			{...rootAttrs}
			className={mergeClassNames(
				"m-0 grid gap-2",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<video
				{...targetAttrs?.media}
				src={src || undefined}
				poster={poster || undefined}
				aria-label={title}
				controls={controls}
				autoPlay={autoPlay}
				muted={muted}
				loop={loop}
				playsInline
				preload="metadata"
				className={mergeClassNames(
					"w-full rounded-lg bg-black object-cover",
					aspectClasses[aspectRatio],
					classNames?.media,
				)}
			>
				{captionsSrc ? (
					<track
						kind="captions"
						src={captionsSrc}
						srcLang="en"
						label="English"
						default
					/>
				) : null}
			</video>
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
