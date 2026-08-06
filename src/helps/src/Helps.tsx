import { Avatar, AvatarFallback, AvatarImage } from "@anvilkit/ui/avatar";
import { Button as BaseButton, buttonVariants } from "@anvilkit/ui/button";
import {
	AvatarGroup,
	AvatarGroupTooltip,
	AvatarGroupTooltipArrow,
} from "@anvilkit/ui/components/animate-ui/primitives/animate/avatar-group";
import { cn } from "@anvilkit/ui/lib/utils";
import { Ripple } from "@anvilkit/ui/ripple";
import { GitPullRequest } from "lucide-react";
import { Fragment } from "react";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface HelpsAvatar {
	name: string;
	imageUrl?: string;
	initials?: string;
}

export interface HelpsProps {
	message: string;
	buttonLabel: string;
	buttonHref?: string;
	buttonOpenInNewTab?: boolean;
	avatars: HelpsAvatar[];
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface HelpsViewProps extends HelpsProps {
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`content`, `message`, …). */
	targetAttrs?: Record<string, Record<string, string>>;
	editMode?: boolean;
}

function getFallbackInitials(name: string, initials?: string) {
	if (initials?.trim()) {
		return initials.trim().slice(0, 2).toUpperCase();
	}

	const derivedInitials = name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");

	return derivedInitials || "?";
}

export function Helps({
	message,
	buttonLabel,
	buttonHref,
	buttonOpenInNewTab = false,
	avatars,
	classNames,
	animation,
	editMode = false,
	rootAttrs,
	targetAttrs,
}: HelpsViewProps) {
	const anim = animationAttrs(animation);
	const isInteractive = Boolean(buttonHref && !editMode);
	// §2.2 merge: authored classes come AFTER base classes so they win.
	const buttonClassName = cn(
		"h-10 items-center gap-2 px-4 py-2",
		classNames?.button,
	);
	const buttonContent = (
		<>
			<GitPullRequest aria-hidden="true" className="size-5" />
			<span className="whitespace-nowrap">{buttonLabel}</span>
		</>
	);

	return (
		<section
			{...rootAttrs}
			className={cn(
				"relative overflow-hidden bg-background",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<Ripple aria-hidden="true" />

			<div
				{...targetAttrs?.content}
				className={cn(
					"relative z-10 px-4 py-6 text-center md:px-6 md:py-8 lg:px-8 lg:py-12",
					classNames?.content,
				)}
			>
				<p
					{...targetAttrs?.message}
					className={cn(
						"mx-auto mb-6 max-w-prose text-balance text-sm font-medium whitespace-pre-line text-muted-foreground md:mb-8 md:text-base lg:mb-10 lg:text-lg",
						classNames?.message,
					)}
				>
					{message}
				</p>

				{avatars.length > 0 ? (
					<AvatarGroup
						{...targetAttrs?.avatarGroup}
						className={cn(
							"mb-8 justify-center -space-x-4 md:mb-10 md:-space-x-5 lg:mb-12 lg:-space-x-4",
							classNames?.avatarGroup,
						)}
					>
						{avatars.map((avatar) => (
							<Fragment
								key={
									avatar.imageUrl ||
									`${avatar.name}-${avatar.initials || "avatar"}`
								}
							>
								{/* §2.1: one shared target id stamped on EVERY item instance. */}
								<Avatar
									{...targetAttrs?.avatar}
									className={cn(
										"size-10 bg-muted ring-2 ring-background md:size-12 lg:size-14",
										classNames?.avatar,
									)}
								>
									{avatar.imageUrl ? (
										<AvatarImage alt={avatar.name} src={avatar.imageUrl} />
									) : null}
									<AvatarFallback className="text-xs font-semibold text-foreground md:text-sm lg:text-base">
										{getFallbackInitials(avatar.name, avatar.initials)}
									</AvatarFallback>
								</Avatar>
								<AvatarGroupTooltip className="rounded-full border border-border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-md">
									{avatar.name}
									<AvatarGroupTooltipArrow
										className="fill-popover stroke-border"
										height={6}
										width={10}
									/>
								</AvatarGroupTooltip>
							</Fragment>
						))}
					</AvatarGroup>
				) : null}

				<div
					{...targetAttrs?.actions}
					className={cn("flex justify-center", classNames?.actions)}
				>
					{isInteractive ? (
						<a
							{...targetAttrs?.button}
							href={buttonHref}
							target={buttonOpenInNewTab ? "_blank" : undefined}
							rel={buttonOpenInNewTab ? "noreferrer noopener" : undefined}
							className={cn(
								buttonVariants({ variant: "secondary" }),
								buttonClassName,
							)}
						>
							{buttonContent}
						</a>
					) : (
						<BaseButton
							{...targetAttrs?.button}
							type="button"
							variant="secondary"
							disabled={editMode || !buttonHref}
							className={buttonClassName}
						>
							{buttonContent}
						</BaseButton>
					)}
				</div>
			</div>
		</section>
	);
}
