import { cardSizeClassNames } from "./constants";
import type { BentoCardProps } from "./types";
import { cn } from "./utils";

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
