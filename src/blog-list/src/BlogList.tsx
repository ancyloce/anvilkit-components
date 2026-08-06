import { type AnimationProps, animationAttrs } from "./authoring";

export interface BlogListPost {
	title: string;
	description: string;
	href?: string;
	openInNewTab?: boolean;
	imageSrc: string;
	imageAlt: string;
	publishedAt: string;
	publishedLabel?: string;
	relativeLabel?: string;
}

export interface BlogListProps {
	posts: BlogListPost[];
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface BlogListViewProps extends BlogListProps {
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`card`, `cardImage`, …). */
	targetAttrs?: Record<string, Record<string, string>>;
	editMode?: boolean;
}

const cardBaseClassName =
	"block border-b border-border bg-background p-4 transition-colors md:p-5 lg:border-b-0 lg:border-r lg:p-6 last:border-b-0 last:lg:border-r-0";

const cardInteractiveClassName =
	"hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const publishedDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "long",
	day: "numeric",
	year: "numeric",
});

/** §2.2 merge: authored classes come AFTER base classes (no @anvilkit/ui dep → join). */
function mergeClassNames(...classNames: (string | undefined)[]) {
	return classNames.filter(Boolean).join(" ");
}

function formatPublishedLabel(post: BlogListPost) {
	if (post.publishedLabel?.trim()) {
		return post.publishedLabel.trim();
	}

	const publishedDate = new Date(post.publishedAt);

	if (Number.isNaN(publishedDate.getTime())) {
		return post.publishedAt;
	}

	return publishedDateFormatter.format(publishedDate);
}

function getPublishedText(post: BlogListPost) {
	const publishedLabel = formatPublishedLabel(post);
	const relativeLabel = post.relativeLabel?.trim();

	return relativeLabel
		? `${publishedLabel} (${relativeLabel})`
		: publishedLabel;
}

function getCardClassName(isInteractive: boolean) {
	return [cardBaseClassName, isInteractive ? cardInteractiveClassName : ""]
		.filter(Boolean)
		.join(" ");
}

function BlogListCard({
	post,
	editMode,
	classNames,
	targetAttrs,
}: {
	post: BlogListPost;
	editMode: boolean;
	classNames?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}) {
	const isInteractive = Boolean(post.href && !editMode);
	const cardClassName = mergeClassNames(
		getCardClassName(isInteractive),
		classNames?.card,
	);
	const cardContent = (
		<>
			<img
				{...targetAttrs?.cardImage}
				alt={post.imageAlt}
				className={mergeClassNames(
					"aspect-[1200/630] w-full border border-border object-cover object-center",
					classNames?.cardImage,
				)}
				decoding="async"
				height={630}
				loading="lazy"
				src={post.imageSrc}
				width={1200}
			/>
			{/* Text classes sit on the stamped <p> (not the <time>) so the
			    cardMeta target's typography grants actually take effect. */}
			<p
				{...targetAttrs?.cardMeta}
				className={mergeClassNames(
					"my-2 text-xs text-muted-foreground",
					classNames?.cardMeta,
				)}
			>
				<time dateTime={post.publishedAt || undefined}>
					{getPublishedText(post)}
				</time>
			</p>
			<h3
				{...targetAttrs?.cardTitle}
				className={mergeClassNames(
					"mb-2 text-xl font-medium text-foreground md:text-2xl",
					classNames?.cardTitle,
				)}
			>
				{post.title}
			</h3>
			<p
				{...targetAttrs?.cardDescription}
				className={mergeClassNames(
					"text-base leading-7 text-muted-foreground md:text-lg",
					classNames?.cardDescription,
				)}
			>
				{post.description}
			</p>
		</>
	);

	if (isInteractive) {
		return (
			<a
				{...targetAttrs?.card}
				href={post.href}
				target={post.openInNewTab ? "_blank" : undefined}
				rel={post.openInNewTab ? "noreferrer noopener" : undefined}
				className={cardClassName}
			>
				{cardContent}
			</a>
		);
	}

	return (
		<div {...targetAttrs?.card} className={cardClassName}>
			{cardContent}
		</div>
	);
}

export function BlogList({
	posts,
	classNames,
	animation,
	editMode = false,
	rootAttrs,
	targetAttrs,
}: BlogListViewProps) {
	const anim = animationAttrs(animation);

	if (posts.length === 0) {
		return (
			<section
				{...rootAttrs}
				className={mergeClassNames(
					"border border-border bg-background p-6 text-center text-sm text-muted-foreground md:p-8",
					anim.className,
					classNames?.root,
				)}
				style={anim.style}
			>
				Add blog posts to populate this list.
			</section>
		);
	}

	return (
		<section
			{...rootAttrs}
			className={mergeClassNames(
				"grid grid-cols-1 border border-border border-b-0 bg-background lg:grid-cols-3",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			{posts.map((post) => (
				<BlogListCard
					key={`${post.title}-${post.publishedAt}-${post.href || "card"}`}
					post={post}
					editMode={editMode}
					classNames={classNames}
					targetAttrs={targetAttrs}
				/>
			))}
		</section>
	);
}
