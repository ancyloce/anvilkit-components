import {
	Brain,
	Code,
	Globe,
	type LucideIcon,
	Plug,
	Users,
	Zap,
} from "lucide-react";

export const iconMap = {
	brain: Brain,
	code: Code,
	globe: Globe,
	plug: Plug,
	users: Users,
	zap: Zap,
} satisfies Record<string, LucideIcon>;

export const cardSizeClassNames = {
	default: "md:min-h-[16.25rem]",
	tall: "md:row-span-2 md:min-h-[32.5rem]",
	wide: "md:col-span-2 md:min-h-[16.25rem]",
} as const;

export const platformContainerClassNames = {
	adaptive: "max-w-[80rem]",
	mobile: "max-w-[28rem]",
	tablet: "max-w-5xl",
	desktop: "max-w-[80rem]",
} as const;

export const platformGridClassNames = {
	adaptive: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
	mobile: "grid-cols-1",
	tablet: "grid-cols-1 sm:grid-cols-2",
	desktop: "grid-cols-1 lg:grid-cols-3",
} as const;

export const platformContentClassNames = {
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

export const themeClassNames = {
	system: "anvilkit-bento-grid--theme-system",
	light: "anvilkit-bento-grid--theme-light",
	dark: "anvilkit-bento-grid--theme-dark",
} as const;
