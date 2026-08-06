import { Button as BaseButton } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";
import { RainbowButton } from "@anvilkit/ui/rainbow-button";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface HeroProps {
	announcementLabel: string;
	announcementHref?: string;
	announcementOpenInNewTab?: boolean;
	headline: string;
	description: string;
	linuxLabel: string;
	linuxHref?: string;
	linuxOpenInNewTab?: boolean;
	windowsLabel: string;
	windowsHref?: string;
	windowsOpenInNewTab?: boolean;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface HeroViewProps extends HeroProps {
	editMode?: boolean;
	/**
	 * Editor-stamped root attributes (AnvilKit visual editor,
	 * `styleTarget: "root"`). Spread onto the root element; absent in
	 * normal rendering. Legacy v1 path — superseded by `rootAttrs`,
	 * retained until the v1 runtime is deleted (PLAN-0025 Phase 6).
	 */
	editorDataAttributes?: Readonly<Record<string, string>>;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/**
	 * Named-target attributes keyed by target id (`content`, `badge`,
	 * `headline`, `description`, `actions`, `cta`).
	 */
	targetAttrs?: Record<string, Record<string, string>>;
}

interface DownloadButtonProps {
	label: string;
	href?: string;
	openInNewTab?: boolean;
	variant: "default" | "outline";
	className: string;
	/** §2.2 authored classes for the shared `cta` target — merged last. */
	authoredClassName?: string;
	/** §6.2 `cta` target attributes, stamped on every CTA instance. */
	targetAttrs?: Record<string, string>;
	editMode: boolean;
}

const ctaBaseClassName =
	"h-12 w-full max-w-[22rem] rounded-[0.95rem] px-6 text-sm font-semibold shadow-none sm:h-14 sm:w-auto sm:min-w-[15.5rem] sm:px-7 sm:text-base lg:h-[3.75rem] lg:min-w-[17rem] lg:text-[1.125rem]";

function DownloadButton({
	label,
	href,
	openInNewTab = false,
	variant,
	className,
	authoredClassName,
	targetAttrs,
	editMode,
}: DownloadButtonProps) {
	const isInteractive = Boolean(href && !editMode);
	const buttonClassName = cn(ctaBaseClassName, className, authoredClassName);

	if (isInteractive) {
		return (
			<BaseButton
				{...targetAttrs}
				render={
					<a
						href={href}
						target={openInNewTab ? "_blank" : undefined}
						rel={openInNewTab ? "noreferrer noopener" : undefined}
						aria-label={label}
					/>
				}
				nativeButton={false}
				variant={variant}
				size="lg"
				className={buttonClassName}
			>
				{label}
			</BaseButton>
		);
	}

	return (
		<BaseButton
			{...targetAttrs}
			type="button"
			variant={variant}
			size="lg"
			disabled={editMode}
			className={buttonClassName}
		>
			{label}
		</BaseButton>
	);
}

export function Hero({
	announcementLabel,
	announcementHref,
	announcementOpenInNewTab = false,
	headline,
	description,
	linuxLabel,
	linuxHref,
	linuxOpenInNewTab = false,
	windowsLabel,
	windowsHref,
	windowsOpenInNewTab = false,
	classNames,
	animation,
	editMode = false,
	editorDataAttributes,
	rootAttrs,
	targetAttrs,
}: HeroViewProps) {
	const anim = animationAttrs(animation);
	const isAnnouncementInteractive = Boolean(announcementHref && !editMode);
	// §2.2 merge: authored classes come AFTER base classes (cn wins ties).
	const badgeClassName = cn(
		"h-11 rounded-full px-5 text-sm sm:h-12 sm:px-6 sm:text-base",
		classNames?.badge,
	);
	const contentClassName = cn(
		"anvilkit-hero__theme relative z-10 mx-auto flex flex-col items-center px-4 text-center sm:px-6 lg:px-8",
		editMode
			? "min-h-0 max-w-[110rem] pb-0 pt-12 sm:pb-0 sm:pt-14 lg:pb-0 lg:pt-16"
			: "min-h-[38rem] max-w-[110rem] pb-0 pt-16 sm:min-h-[44rem] sm:pb-0 sm:pt-20 lg:min-h-[52rem] lg:pb-0 lg:pt-32",
		classNames?.content,
	);

	return (
		<section
			{...editorDataAttributes}
			{...rootAttrs}
			className={cn("anvilkit-hero", anim.className, classNames?.root)}
			style={anim.style}
		>
			<div aria-hidden="true" className="anvilkit-hero__backdrop" />

			<div {...targetAttrs?.content} className={contentClassName}>
				{isAnnouncementInteractive ? (
					<RainbowButton
						{...targetAttrs?.badge}
						asChild
						size="lg"
						className={badgeClassName}
					>
						<a
							href={announcementHref}
							target={announcementOpenInNewTab ? "_blank" : undefined}
							rel={announcementOpenInNewTab ? "noreferrer noopener" : undefined}
						>
							{announcementLabel}
						</a>
					</RainbowButton>
				) : (
					<RainbowButton
						{...targetAttrs?.badge}
						type="button"
						size="lg"
						disabled={editMode}
						className={badgeClassName}
					>
						{announcementLabel}
					</RainbowButton>
				)}

				<div className="mt-8 max-w-[19rem] sm:mt-10 sm:max-w-[34rem] lg:max-w-[58rem]">
					<h1
						{...targetAttrs?.headline}
						data-ak-text-target="headline"
						className={cn(
							"whitespace-pre-line text-[clamp(2.9rem,14vw,7.25rem)] leading-[0.92] font-black tracking-[-0.06em] text-foreground sm:tracking-[-0.075em]",
							classNames?.headline,
						)}
					>
						{headline}
					</h1>
				</div>

				<p
					{...targetAttrs?.description}
					data-ak-text-target="description"
					className={cn(
						"mt-5 max-w-[22rem] whitespace-pre-line text-base leading-[1.5] font-normal text-muted-foreground sm:mt-6 sm:max-w-[34rem] sm:text-[1.12rem] lg:mt-7 lg:max-w-[48rem] lg:text-[1.45rem]",
						classNames?.description,
					)}
				>
					{description}
				</p>

				<div
					{...targetAttrs?.actions}
					className={cn(
						"mt-8 flex w-full max-w-[22rem] flex-col items-center justify-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:gap-5",
						classNames?.actions,
					)}
				>
					<DownloadButton
						label={linuxLabel}
						href={linuxHref}
						openInNewTab={linuxOpenInNewTab}
						variant="outline"
						editMode={editMode}
						className="border-border bg-background/90 text-foreground hover:bg-background hover:text-foreground"
						authoredClassName={classNames?.cta}
						targetAttrs={targetAttrs?.cta}
					/>
					<DownloadButton
						label={windowsLabel}
						href={windowsHref}
						openInNewTab={windowsOpenInNewTab}
						variant="default"
						editMode={editMode}
						className="border-transparent bg-primary text-primary-foreground shadow-[0_14px_36px_var(--hero-primary-shadow)] hover:bg-primary/90 hover:text-primary-foreground"
						authoredClassName={classNames?.cta}
						targetAttrs={targetAttrs?.cta}
					/>
				</div>
			</div>
		</section>
	);
}
