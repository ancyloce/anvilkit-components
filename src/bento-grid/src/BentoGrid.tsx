import {
	Brain,
	Code,
	Globe,
	type LucideIcon,
	Plug,
	Users,
	Zap,
} from "lucide-react";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";

type ClassNameValue = false | null | string | undefined;

const iconMap = {
	brain: Brain,
	code: Code,
	globe: Globe,
	plug: Plug,
	users: Users,
	zap: Zap,
} satisfies Record<string, LucideIcon>;

const cardSizeClassNames = {
	default: "md:min-h-[16.25rem]",
	tall: "md:row-span-2 md:min-h-[32.5rem]",
	wide: "md:col-span-2 md:min-h-[16.25rem]",
} as const;

const platformContainerClassNames = {
	adaptive: "max-w-[80rem]",
	mobile: "max-w-[28rem]",
	tablet: "max-w-5xl",
	desktop: "max-w-[80rem]",
} as const;

const platformGridClassNames = {
	adaptive: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
	mobile: "grid-cols-1",
	tablet: "grid-cols-1 sm:grid-cols-2",
	desktop: "grid-cols-1 lg:grid-cols-3",
} as const;

const platformContentClassNames = {
	adaptive: {
		body: "items-center text-center",
		copy: "mx-auto",
		icon: "justify-center",
	},
	mobile: {
		body: "items-center text-center",
		copy: "mx-auto",
		icon: "justify-center",
	},
	tablet: {
		body: "items-center text-center",
		copy: "mx-auto",
		icon: "justify-center",
	},
	desktop: {
		body: "items-center text-center",
		copy: "mx-auto",
		icon: "justify-center",
	},
} as const;

const themeClassNames = {
	system: "anvilkit-bento-grid--theme-system",
	light: "anvilkit-bento-grid--theme-light",
	dark: "anvilkit-bento-grid--theme-dark",
} as const;

export type BentoGridIcon = keyof typeof iconMap;
export type BentoCardSize = keyof typeof cardSizeClassNames;
export type BentoGridPlatform = keyof typeof platformContainerClassNames;
export type BentoGridTheme = keyof typeof themeClassNames;

export interface BentoGridItem {
	icon: BentoGridIcon;
	title: string;
	description: string;
	size?: BentoCardSize;
	rounded?: boolean;
	background?: boolean;
	ctaLabel?: string;
	ctaHref?: string;
	ctaOpenInNewTab?: boolean;
}

export interface BentoGridProps {
	items?: BentoGridItem[];
	children?: ReactNode;
	className?: string;
	platform?: BentoGridPlatform;
	theme?: BentoGridTheme;
}

export interface BentoGridViewProps extends BentoGridProps {
	editMode?: boolean;
}

export interface BentoCardProps extends ComponentPropsWithoutRef<"div"> {
	size?: BentoCardSize;
	rounded?: boolean;
	background?: boolean;
	children: ReactNode;
}

export const bentoGridExampleItems: BentoGridItem[] = [
	{
		icon: "brain",
		title: "Simple Agent Workflows",
		description:
			"Easily create and manage AI agent workflows with intuitive APIs.",
		ctaHref: "#",
	},
	{
		icon: "users",
		title: "Multi-Agent Systems",
		description:
			"Build complex systems with multiple AI agents working together.",
		ctaHref: "#",
	},
	{
		icon: "plug",
		title: "Tool Integration",
		description:
			"Seamlessly integrate external tools and APIs into your agent workflows.",
		ctaHref: "#",
	},
	{
		icon: "globe",
		title: "Cross-Language Support",
		description:
			"Available in all major programming languages for maximum flexibility.",
		ctaHref: "#",
	},
	{
		icon: "code",
		title: "Customizable Agents",
		description:
			"Design and customize agents to fit your specific use case and requirements.",
		ctaHref: "#",
	},
	{
		icon: "zap",
		title: "Efficient Execution",
		description:
			"Optimize agent performance with built-in efficiency and scalability features.",
		ctaHref: "#",
	},
];

function cn(...values: ClassNameValue[]) {
	return values.filter(Boolean).join(" ");
}

function getItemKey(item: BentoGridItem) {
	return [item.icon, item.title, item.ctaHref, item.ctaLabel]
		.filter(Boolean)
		.join("-");
}

function IconBadge({
	icon,
	background,
}: {
	icon: BentoGridIcon;
	background: boolean;
}) {
	const Icon = iconMap[icon];

	return (
		<div
			className={cn(
				"flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-[0.85rem] sm:h-[3.35rem] sm:w-[3.35rem]",
				background
					? "bg-primary text-primary-foreground"
					: "bg-primary/15 text-primary",
			)}
		>
			<Icon aria-hidden="true" className="h-6 w-6" />
		</div>
	);
}

function ItemCallToAction({
	item,
	editMode,
}: {
	item: BentoGridItem;
	editMode: boolean;
}) {
	const label = item.ctaLabel || "Learn more >";
	const className =
		"text-[1.08rem] leading-none font-medium text-primary transition-opacity hover:opacity-85";

	if (!item.ctaHref || editMode) {
		return (
			<span
				aria-disabled="true"
				className={cn(className, "pointer-events-none opacity-70")}
			>
				{label}
			</span>
		);
	}

	return (
		<a
			href={item.ctaHref}
			target={item.ctaOpenInNewTab ? "_blank" : undefined}
			rel={item.ctaOpenInNewTab ? "noreferrer noopener" : undefined}
			className={className}
		>
			{label}
		</a>
	);
}

function BentoCardContent({
	item,
	editMode,
	platform,
}: {
	item: BentoGridItem;
	editMode: boolean;
	platform: BentoGridPlatform;
}) {
	const background = item.background ?? true;
	const platformContent = platformContentClassNames[platform];

	return (
		<div
			className={cn(
				"mx-auto flex max-w-[21rem] flex-col items-center justify-center gap-6",
				platformContent.body,
			)}
		>
			<div className={cn("flex w-full", platformContent.icon)}>
				<IconBadge icon={item.icon} background={background} />
			</div>
			<div className="space-y-[1.15rem]">
				<h2 className="text-balance text-[2rem] leading-[1.08] font-semibold tracking-[-0.05em] text-card-foreground sm:text-[2.15rem]">
					{item.title}
				</h2>
				<p
					className={cn(
						"max-w-[17.5rem] text-[1.08rem] leading-[1.45] text-muted-foreground",
						platformContent.copy,
					)}
				>
					{item.description}
				</p>
			</div>
			<div className="pt-0.5">
				<ItemCallToAction item={item} editMode={editMode} />
			</div>
		</div>
	);
}

export function BentoGrid({
	items = [],
	children,
	className,
	platform = "adaptive",
	theme = "dark",
	editMode = false,
}: BentoGridViewProps) {
	return (
		<section
			className={cn(
				"anvilkit-bento-grid relative isolate mx-auto w-full overflow-hidden rounded-none !border-0 !bg-[var(--bento-theme-background)] !shadow-none",
				platformContainerClassNames[platform],
				themeClassNames[theme],
				className,
			)}
			data-platform={platform}
			data-theme={theme}
		>
			<div className="anvilkit-bento-grid__theme relative !p-0">
				<div
					className={cn(
						"grid auto-rows-fr gap-px bg-border",
						platformGridClassNames[platform],
					)}
				>
					{children ??
						items.map((item) => (
							<BentoCard
								key={getItemKey(item)}
								size={item.size}
								rounded={item.rounded}
								background={item.background}
							>
								<BentoCardContent
									item={item}
									editMode={editMode}
									platform={platform}
								/>
							</BentoCard>
						))}
				</div>
			</div>
		</section>
	);
}

export function BentoCard({
	size = "default",
	rounded = false,
	background = true,
	children,
	className,
	...props
}: BentoCardProps) {
	return (
		<div
			className={cn(
				"anvilkit-bento-card relative isolate flex h-full min-h-[16.25rem] flex-col items-center justify-center overflow-hidden border-0 rounded-none bg-background px-6 py-10 sm:px-8 sm:py-12",
				background ? "" : "opacity-95",
				rounded ? "rounded-[1.5rem]" : "rounded-none",
				cardSizeClassNames[size],
				className,
			)}
			{...props}
		>
			<div className="relative z-10 flex w-full flex-col items-center justify-center">
				{children}
			</div>
		</div>
	);
}

export function BentoGridExample() {
	return <BentoGrid items={bentoGridExampleItems} />;
}
