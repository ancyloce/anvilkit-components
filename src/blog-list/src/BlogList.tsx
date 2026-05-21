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
}

export interface BlogListViewProps extends BlogListProps {
	editMode?: boolean;
}

const cardBaseClassName =
	"block border-b border-border bg-background p-4 transition-colors md:p-5 lg:border-b-0 lg:border-r lg:p-6 last:border-b-0 last:lg:border-r-0";

const cardInteractiveClassName =
	"hover:bg-secondary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function formatPublishedLabel(post: BlogListPost) {
	if (post.publishedLabel?.trim()) {
		return post.publishedLabel.trim();
	}

	const publishedDate = new Date(post.publishedAt);

	if (Number.isNaN(publishedDate.getTime())) {
		return post.publishedAt;
	}

	return new Intl.DateTimeFormat("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	}).format(publishedDate);
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
}: {
	post: BlogListPost;
	editMode: boolean;
}) {
	const isInteractive = Boolean(post.href && !editMode);
	const cardClassName = getCardClassName(isInteractive);
	const cardContent = (
		<>
			<img
				alt={post.imageAlt}
				className="h-auto w-full border border-border object-cover"
				decoding="async"
				height={630}
				loading="lazy"
				src={post.imageSrc}
				width={1200}
			/>
			<p className="my-2">
				<time
					dateTime={post.publishedAt || undefined}
					className="text-xs text-muted-foreground"
				>
					{getPublishedText(post)}
				</time>
			</p>
			<h3 className="mb-2 text-xl font-medium text-foreground md:text-2xl">
				{post.title}
			</h3>
			<p className="text-base leading-7 text-muted-foreground md:text-lg">
				{post.description}
			</p>
		</>
	);

	if (isInteractive) {
		return (
			<a
				href={post.href}
				target={post.openInNewTab ? "_blank" : undefined}
				rel={post.openInNewTab ? "noreferrer noopener" : undefined}
				className={cardClassName}
			>
				{cardContent}
			</a>
		);
	}

	return <div className={cardClassName}>{cardContent}</div>;
}

export function BlogList({ posts, editMode = false }: BlogListViewProps) {
	if (posts.length === 0) {
		return (
			<section className="border border-border bg-background p-6 text-center text-sm text-muted-foreground md:p-8">
				Add blog posts to populate this list.
			</section>
		);
	}

	return (
		<section className="grid grid-cols-1 border border-border border-b-0 bg-background lg:grid-cols-3">
			{posts.map((post) => (
				<BlogListCard
					key={`${post.title}-${post.publishedAt}-${post.href || "card"}`}
					post={post}
					editMode={editMode}
				/>
			))}
		</section>
	);
}
