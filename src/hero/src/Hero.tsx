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
	"h-[3.75rem] min-w-[15.5rem] rounded-[0.95rem] px-7 text-base font-semibold shadow-none sm:min-w-[17rem] sm:text-[1.125rem]";

function renderAnchor(href?: string, target?: string, rel?: string) {
	return <a href={href} target={target} rel={rel} />;
}

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
				render={renderAnchor(
					href,
					openInNewTab ? "_blank" : undefined,
					openInNewTab ? "noreferrer noopener" : undefined,
				)}
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

function PreviewDot({ className }: { className: string }) {
	return <span className={cn("size-3.5 rounded-full", className)} />;
}

function PreviewToolbarChip({
	label,
	className,
}: {
	label: string;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-[0.65rem] border border-white/8 bg-white/[0.06] px-4 py-2 text-[0.95rem] font-medium text-white/80",
				className,
			)}
		>
			{label}
		</span>
	);
}

function HeroPreview() {
	return (
		<div className="anvilkit-hero__browser overflow-hidden rounded-[1.5rem] border border-white/8 bg-[#171925]">
			<div className="grid grid-cols-[13.5rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)_25rem]">
				<div className="flex h-16 items-center gap-5 px-4 lg:px-5">
					<div className="flex items-center gap-2.5">
						<PreviewDot className="bg-white/28" />
						<PreviewDot className="bg-white/24" />
						<PreviewDot className="bg-white/22" />
					</div>
					<div className="hidden items-center gap-3 md:flex">
						<span className="grid size-7 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
							<span className="ml-1 size-2.5 rotate-45 border-b border-l border-white/55" />
						</span>
						<span className="grid size-7 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
							<span className="mr-1 size-2.5 rotate-45 border-r border-t border-white/55" />
						</span>
						<span className="grid size-7 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
							<span className="size-3 rounded-full border border-white/45" />
						</span>
					</div>
				</div>

				<div className="flex h-16 items-center justify-between border-l border-white/6 px-4 lg:border-x lg:px-7">
					<div className="flex min-w-0 items-center gap-3">
						<div className="grid size-5 place-items-center rounded-full bg-[#6d73ff]/30 ring-1 ring-inset ring-[#8f94ff]/25">
							<div className="size-2.5 rounded-full bg-[#7a80ff]" />
						</div>
						<span className="truncate text-sm font-medium text-white/88 lg:text-[1.12rem]">
							Project Solar Sailer
						</span>
						<span className="hidden size-2.5 rotate-45 border-b border-r border-white/35 sm:block" />
						<span className="hidden text-white/25 sm:block">*</span>
					</div>

					<div className="hidden items-center gap-3 lg:flex">
						<PreviewToolbarChip label="Updates" />
						<PreviewToolbarChip label="View" />
						<span className="grid size-10 place-items-center rounded-[0.7rem] border border-white/8 bg-white/[0.05]">
							<span className="size-4 rounded-[0.35rem] border border-white/65" />
						</span>
					</div>
				</div>

				<div className="hidden h-16 items-center gap-4 px-6 lg:flex">
					<div className="grid size-10 place-items-center rounded-[0.8rem] border border-white/8 bg-[#202433]">
						<div className="size-4 rounded-full bg-[#6f75ff]/55" />
					</div>
					<div className="h-3 w-36 rounded-full bg-white/[0.08]" />
				</div>
			</div>

			<div className="grid min-h-[11rem] grid-cols-[13.5rem_minmax(0,1fr)] lg:grid-cols-[16rem_minmax(0,1fr)_25rem]">
				<div className="border-t border-white/6 bg-[#161926] p-4 lg:p-5">
					<div className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="grid size-10 place-items-center rounded-[0.95rem] bg-[linear-gradient(135deg,#6570ff,#3446d7)] shadow-[0_12px_24px_rgba(40,58,185,0.45)]">
								<div className="size-4 rounded-[0.55rem] border border-white/50 bg-white/12" />
							</div>
							<span className="text-[1.1rem] font-medium text-white/90">
								Linear
							</span>
						</div>
						<div className="size-8 rounded-full bg-white/[0.08]" />
					</div>
				</div>

				<div className="border-t border-l border-white/6 bg-[#151925] p-4 lg:border-r lg:px-5 lg:py-4">
					<div className="flex flex-wrap items-center gap-3">
						<PreviewToolbarChip
							label="Engineering 89%"
							className="bg-[#232734] text-white/70"
						/>
						<PreviewToolbarChip
							label="Filter"
							className="px-3.5 text-white/62"
						/>
						<div className="ml-auto hidden items-center gap-3 lg:flex">
							<span className="grid size-9 place-items-center rounded-[0.65rem] border border-white/8 bg-white/[0.06]">
								<span className="grid gap-1">
									<span className="h-0.5 w-3 rounded-full bg-white/60" />
									<span className="h-0.5 w-3 rounded-full bg-white/60" />
									<span className="h-0.5 w-3 rounded-full bg-white/60" />
								</span>
							</span>
							<span className="grid size-9 place-items-center rounded-[0.65rem] border border-white/8 bg-white/[0.06]">
								<span className="grid grid-cols-2 gap-1">
									<span className="size-1.5 rounded-full bg-white/55" />
									<span className="size-1.5 rounded-full bg-white/55" />
									<span className="size-1.5 rounded-full bg-white/55" />
									<span className="size-1.5 rounded-full bg-white/55" />
								</span>
							</span>
						</div>
					</div>

					<div className="mt-5 grid gap-3">
						<div className="h-3 rounded-full bg-white/[0.08]" />
						<div className="h-3 w-5/6 rounded-full bg-white/[0.08]" />
						<div className="h-3 w-3/5 rounded-full bg-white/[0.08]" />
					</div>
				</div>

				<div className="hidden border-t border-white/6 bg-[#151925] px-6 py-5 lg:block">
					<div className="flex items-center gap-4">
						<div className="grid size-11 place-items-center rounded-[0.85rem] border border-white/8 bg-[#202433]">
							<div className="size-4 rounded-full bg-[#6f75ff]/60" />
						</div>
						<div className="min-w-0">
							<p className="truncate text-[1.15rem] font-medium text-white/92">
								Project Solar Sailer
							</p>
							<div className="mt-2 h-2.5 w-40 rounded-full bg-white/[0.08]" />
						</div>
					</div>

					<div className="mt-6 grid gap-3">
						<div className="h-3 rounded-full bg-white/[0.08]" />
						<div className="h-3 w-11/12 rounded-full bg-white/[0.08]" />
						<div className="h-3 w-4/5 rounded-full bg-white/[0.08]" />
					</div>
				</div>
			</div>
		</div>
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
}: HeroViewProps) {
	const isAnnouncementInteractive = Boolean(announcementHref && !editMode);

	return (
		<section className="anvilkit-hero">
			<div aria-hidden="true" className="anvilkit-hero__backdrop" />

			<div className="relative z-10 mx-auto flex min-h-[52rem] max-w-[110rem] flex-col items-center px-4 pb-[18rem] pt-24 text-center sm:px-6 sm:pb-[20rem] sm:pt-28 lg:px-8 lg:pb-[22rem] lg:pt-32">
				{isAnnouncementInteractive ? (
					<RainbowButton
						asChild
						size="lg"
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
					>
						{announcementLabel}
					</RainbowButton>
				)}

				<div className="mt-10 max-w-[58rem]">
					<h1 className="whitespace-pre-line text-[clamp(3.5rem,8vw,7.25rem)] leading-[0.92] font-black tracking-[-0.075em] text-white">
						{headline}
					</h1>
				</div>

				<p className="mt-7 max-w-[48rem] whitespace-pre-line text-[1.18rem] leading-[1.38] font-normal text-[#c7c2c6] sm:text-[1.45rem]">
					{description}
				</p>

				<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
					<DownloadButton
						label={linuxLabel}
						href={linuxHref}
						openInNewTab={linuxOpenInNewTab}
						variant="outline"
						editMode={editMode}
						className="border-white bg-white text-[#050506] hover:bg-white/92 hover:text-[#050506]"
					/>
					<DownloadButton
						label={windowsLabel}
						href={windowsHref}
						openInNewTab={windowsOpenInNewTab}
						variant="default"
						editMode={editMode}
						className="border-transparent bg-[#ff2c62] text-white hover:bg-[#ff2c62]/92 hover:text-white"
					/>
				</div>
			</div>

			<div
				aria-hidden="true"
				className="anvilkit-hero__preview pointer-events-none absolute inset-x-0 bottom-[-7.25rem] z-10"
			>
				<div className="mx-auto max-w-[100rem] px-4">
					<HeroPreview />
				</div>
			</div>
		</section>
	);
}
