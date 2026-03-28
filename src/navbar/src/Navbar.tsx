import { Button as BaseButton, buttonVariants } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";
import { Link } from "@anvilkit/ui/link";
import type { MouseEventHandler, ReactNode } from "react";

export interface NavbarLogoProps {
	type?: "text" | "image";
	text?: string;
	imageUrl?: string;
	alt?: string;
	href?: string;
}

export interface NavbarMenuItem {
	label: string;
	href: string;
}

export type NavbarActionVariant =
	| "default"
	| "destructive"
	| "ghost"
	| "link"
	| "outline"
	| "secondary";

export type NavbarActionSize = "default" | "lg" | "sm";

export interface NavbarAction {
	label: string;
	href?: string;
	variant?: NavbarActionVariant;
	size?: NavbarActionSize;
	openInNewTab?: boolean;
	disabled?: boolean;
}

export interface NavbarActionViewProps extends NavbarAction {
	onClick?: MouseEventHandler<HTMLElement>;
}

export interface NavbarProps {
	logo: NavbarLogoProps;
	items: NavbarMenuItem[];
	actions: NavbarAction[];
	active?: string;
}

export interface NavbarViewProps extends Omit<NavbarProps, "actions"> {
	actions?: NavbarActionViewProps[];
	logoNode?: ReactNode;
	className?: string;
	editMode?: boolean;
}

const actionClassName = "rounded-full px-5 shadow-none";

const navLinkClassName =
	"group/link relative inline-flex rounded-full px-4 py-2 text-sm font-medium text-primary-foreground/72 transition-colors hover:text-primary-foreground focus-visible:text-primary-foreground";

function getLogoContent(logo: NavbarLogoProps, logoNode?: ReactNode) {
	if (logoNode) {
		return logoNode;
	}

	if (logo.type === "image" && logo.imageUrl) {
		return (
			<img
				src={logo.imageUrl}
				alt={logo.alt || logo.text || "Logo"}
				className="h-9 w-auto max-w-40 object-contain"
			/>
		);
	}

	return (
		<span className="text-lg font-semibold tracking-tight text-primary-foreground">
			{logo.text || "Brand"}
		</span>
	);
}

function renderAction(
	action: NavbarActionViewProps,
	index: number,
	editMode: boolean,
) {
	const isDisabled = Boolean(action.disabled || editMode);
	const resolvedVariant = action.variant || "secondary";
	const resolvedSize = action.size || "lg";
	const key = `${action.label}-${action.href || "button"}-${index}`;

	if (action.href) {
		return (
			<Link
				key={key}
				href={isDisabled ? undefined : action.href}
				onClick={isDisabled ? undefined : action.onClick}
				target={!isDisabled && action.openInNewTab ? "_blank" : undefined}
				rel={
					!isDisabled && action.openInNewTab ? "noreferrer noopener" : undefined
				}
				aria-disabled={isDisabled || undefined}
				tabIndex={isDisabled ? -1 : undefined}
				variant="unstyled"
				className={cn(
					buttonVariants({
						size: resolvedSize,
						variant: resolvedVariant,
					}),
					actionClassName,
					isDisabled && "pointer-events-none opacity-50",
				)}
			>
				{action.label}
			</Link>
		);
	}

	return (
		<BaseButton
			key={key}
			type="button"
			variant={resolvedVariant}
			size={resolvedSize}
			disabled={isDisabled}
			onClick={isDisabled ? undefined : action.onClick}
			className={actionClassName}
		>
			{action.label}
		</BaseButton>
	);
}

export function Navbar({
	logo,
	logoNode,
	items,
	actions = [],
	active,
	className,
	editMode = false,
}: NavbarViewProps) {
	const logoContent = getLogoContent(logo, logoNode);
	const isLogoInteractive = Boolean(logo.href && !editMode);

	return (
		<nav aria-label="Primary" className={cn("w-full", className)}>
			<div className="rounded-[1.75rem] border border-primary-foreground/12 bg-primary px-4 py-3 shadow-sm sm:px-5 lg:px-6">
				<div className="flex flex-col gap-4 md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:gap-6">
					<div className="flex min-w-0 items-center md:justify-self-start">
						{isLogoInteractive ? (
							<Link
								href={logo.href}
								variant="unstyled"
								className="inline-flex min-w-0 items-center gap-3 rounded-full px-1 py-1"
							>
								{logoContent}
							</Link>
						) : (
							<div className="inline-flex min-w-0 items-center gap-3 px-1 py-1">
								{logoContent}
							</div>
						)}
					</div>

					{items.length > 0 ? (
						<div className="flex min-w-0 justify-center">
							<ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
								{items.map((item, index) => {
									const isActive = item.href === active;
									const key = `${item.label}-${item.href}-${index}`;

									return (
										<li key={key}>
											<Link
												href={editMode ? undefined : item.href}
												variant="unstyled"
												aria-current={isActive ? "page" : undefined}
												aria-disabled={editMode || undefined}
												tabIndex={editMode ? -1 : undefined}
												className={cn(
													navLinkClassName,
													isActive && "text-primary-foreground",
												)}
											>
												<span>{item.label}</span>
												<span
													aria-hidden="true"
													className={cn(
														"pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-center scale-x-0 bg-primary-foreground transition-transform duration-200 group-hover/link:scale-x-100",
														isActive && "scale-x-100",
													)}
												/>
											</Link>
										</li>
									);
								})}
							</ul>
						</div>
					) : (
						<div className="hidden md:block" />
					)}

					{actions.length > 0 ? (
						<div className="flex flex-wrap items-center justify-start gap-3 md:justify-self-end md:justify-end">
							{actions.map((action, index) =>
								renderAction(action, index, editMode),
							)}
						</div>
					) : (
						<div className="hidden md:block" />
					)}
				</div>
			</div>
		</nav>
	);
}
