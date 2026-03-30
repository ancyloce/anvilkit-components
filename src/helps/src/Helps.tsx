import { Avatar, AvatarFallback, AvatarImage } from "@anvilkit/ui/avatar";
import {
	AvatarGroup,
	AvatarGroupTooltip,
	AvatarGroupTooltipArrow,
} from "@anvilkit/ui/components/animate-ui/primitives/animate/avatar-group";
import { Button as BaseButton, buttonVariants } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";
import { Ripple } from "@anvilkit/ui/ripple";
import { GitPullRequest } from "lucide-react";
import { Fragment } from "react";

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
}

export interface HelpsViewProps extends HelpsProps {
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
	editMode = false,
}: HelpsViewProps) {
	const isInteractive = Boolean(buttonHref && !editMode);
	const buttonContent = (
		<>
			<GitPullRequest aria-hidden="true" className="size-5" />
			<span className="whitespace-nowrap">{buttonLabel}</span>
		</>
	);

	return (
		<section className="relative overflow-hidden bg-background">
			<Ripple aria-hidden="true" />

			<div className="relative z-10 px-4 py-6 text-center md:px-6 md:py-8 lg:px-8 lg:py-12">
				<p className="mx-auto mb-6 max-w-prose text-balance text-sm font-medium whitespace-pre-line text-muted-foreground md:mb-8 md:text-base lg:mb-10 lg:text-lg">
					{message}
				</p>

				{avatars.length > 0 ? (
					<AvatarGroup className="mb-8 justify-center -space-x-4 md:mb-10 md:-space-x-5 lg:mb-12 lg:-space-x-4">
						{avatars.map((avatar) => (
							<Fragment
								key={
									avatar.imageUrl ||
									`${avatar.name}-${avatar.initials || "avatar"}`
								}
							>
								<Avatar className="size-10 bg-muted ring-2 ring-background md:size-12 lg:size-14">
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

				<div className="flex justify-center">
					{isInteractive ? (
						<a
							href={buttonHref}
							target={buttonOpenInNewTab ? "_blank" : undefined}
							rel={buttonOpenInNewTab ? "noreferrer noopener" : undefined}
							className={cn(
								buttonVariants({ variant: "secondary" }),
								"h-10 items-center gap-2 px-4 py-2",
							)}
						>
							{buttonContent}
						</a>
					) : (
						<BaseButton
							type="button"
							variant="secondary"
							disabled={editMode || !buttonHref}
							className="h-10 items-center gap-2 px-4 py-2"
						>
							{buttonContent}
						</BaseButton>
					)}
				</div>
			</div>
		</section>
	);
}
