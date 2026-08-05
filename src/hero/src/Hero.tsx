import { Button as BaseButton } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";
import { RainbowButton } from "@anvilkit/ui/rainbow-button";

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
	/** Named-target attributes keyed by target id (`content`, `actions`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

interface DownloadButtonProps {
	label: string;
	href?: string;
	openInNewTab?: boolean;
	variant: "default" | "outline";
	className: string;
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
	editMode,
}: DownloadButtonProps) {
	const isInteractive = Boolean(href && !editMode);

	if (isInteractive) {
		return (
			<BaseButton
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
				className={cn(ctaBaseClassName, className)}
			>
				{label}
			</BaseButton>
		);
	}

	return (
		<BaseButton
			type="button"
			variant={variant}
			size="lg"
			disabled={editMode}
			className={cn(ctaBaseClassName, className)}
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
	editMode = false,
	editorDataAttributes,
	rootAttrs,
	targetAttrs,
}: HeroViewProps) {
	const isAnnouncementInteractive = Boolean(announcementHref && !editMode);
	const contentClassName = cn(
		"anvilkit-hero__theme relative z-10 mx-auto flex flex-col items-center px-4 text-center sm:px-6 lg:px-8",
		editMode
			? "min-h-0 max-w-[110rem] pb-0 pt-12 sm:pb-0 sm:pt-14 lg:pb-0 lg:pt-16"
			: "min-h-[38rem] max-w-[110rem] pb-0 pt-16 sm:min-h-[44rem] sm:pb-0 sm:pt-20 lg:min-h-[52rem] lg:pb-0 lg:pt-32",
	);

	return (
		<section {...editorDataAttributes} {...rootAttrs} className="anvilkit-hero">
			<div aria-hidden="true" className="anvilkit-hero__backdrop" />

			<div {...targetAttrs?.content} className={contentClassName}>
				{isAnnouncementInteractive ? (
					<RainbowButton
						asChild
						size="lg"
						className="h-11 rounded-full px-5 text-sm sm:h-12 sm:px-6 sm:text-base"
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
						type="button"
						size="lg"
						disabled={editMode}
						className="h-11 rounded-full px-5 text-sm sm:h-12 sm:px-6 sm:text-base"
					>
						{announcementLabel}
					</RainbowButton>
				)}

				<div className="mt-8 max-w-[19rem] sm:mt-10 sm:max-w-[34rem] lg:max-w-[58rem]">
					<h1
						data-ak-text-target="headline"
						className="whitespace-pre-line text-[clamp(2.9rem,14vw,7.25rem)] leading-[0.92] font-black tracking-[-0.06em] text-foreground sm:tracking-[-0.075em]"
					>
						{headline}
					</h1>
				</div>

				<p
					data-ak-text-target="description"
					className="mt-5 max-w-[22rem] whitespace-pre-line text-base leading-[1.5] font-normal text-muted-foreground sm:mt-6 sm:max-w-[34rem] sm:text-[1.12rem] lg:mt-7 lg:max-w-[48rem] lg:text-[1.45rem]"
				>
					{description}
				</p>

				<div
					{...targetAttrs?.actions}
					className="mt-8 flex w-full max-w-[22rem] flex-col items-center justify-center gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:gap-5"
				>
					<DownloadButton
						label={linuxLabel}
						href={linuxHref}
						openInNewTab={linuxOpenInNewTab}
						variant="outline"
						editMode={editMode}
						className="border-border bg-background/90 text-foreground hover:bg-background hover:text-foreground"
					/>
					<DownloadButton
						label={windowsLabel}
						href={windowsHref}
						openInNewTab={windowsOpenInNewTab}
						variant="default"
						editMode={editMode}
						className="border-transparent bg-primary text-primary-foreground shadow-[0_14px_36px_var(--hero-primary-shadow)] hover:bg-primary/90 hover:text-primary-foreground"
					/>
				</div>
			</div>
		</section>
	);
}
