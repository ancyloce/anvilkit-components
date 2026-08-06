import { ShimmeringText } from "@anvilkit/ui/components/animate-ui/primitives/texts/shimmering";
import { cn } from "@anvilkit/ui/lib/utils";
import { Marquee } from "@anvilkit/ui/marquee";
import { type AnimationProps, animationAttrs } from "./authoring";

const DEVICON_BASE_URL =
	"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

interface LogoCloudItem {
	label: string;
	name: string;
	variant: string;
}

const logoCloudItems = [
	{
		label: "React",
		name: "react",
		variant: "original",
	},
	{
		label: "Tailwind CSS",
		name: "tailwindcss",
		variant: "original",
	},
	{
		label: "Docker",
		name: "docker",
		variant: "original",
	},
	{
		label: "Node.js",
		name: "nodejs",
		variant: "original",
	},
	{
		label: "Amazon Web Services",
		name: "amazonwebservices",
		variant: "plain-wordmark",
	},
	{
		label: "Vue.js",
		name: "vuejs",
		variant: "original",
	},
	{
		label: "Firebase",
		name: "firebase",
		variant: "original",
	},
	{
		label: "GraphQL",
		name: "graphql",
		variant: "plain",
	},
] satisfies readonly LogoCloudItem[];

function getDeviconSource(name: string, variant: string) {
	// Devicon's documented <img> format is /icons/<name>/<name>-<variant>.svg.
	return `${DEVICON_BASE_URL}/${name}/${name}-${variant}.svg`;
}

const rootBaseClassName =
	"anvilkit-logo-clouds__theme mx-auto flex w-full max-w-6xl flex-col items-center overflow-hidden px-4 py-16 text-center text-foreground sm:px-6 sm:py-20 lg:px-8 lg:py-24 [&>:first-child]:mx-auto [&>:first-child]:max-w-3xl [&>:first-child]:text-[clamp(3rem,9vw,4.75rem)] [&>:first-child]:leading-none [&>:first-child]:font-black [&>:first-child]:tracking-[-0.07em] [&>:nth-child(3)]:mt-8 sm:[&>:nth-child(3)]:mt-12 lg:[&>:nth-child(3)]:mt-16";

const titleBaseClassName = "text-4xl font-semibold";

const subtitleBaseClassName =
	"mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:mt-5 sm:text-base sm:leading-7 lg:text-lg";

const logosBaseClassName =
	"relative flex w-full flex-col items-center justify-center overflow-hidden";

const logoItemBaseClassName =
	"flex items-center justify-center px-4 py-4 sm:px-6 lg:px-8";

const logoImageBaseClassName =
	"h-10 w-auto max-w-[11.5rem] object-contain sm:h-11 sm:max-w-[13rem] lg:h-14 lg:max-w-[14.5rem]";

export interface LogoCloudsProps {
	title: string;
	subtitle: string;
	/** Accessible label for the scrolling logo marquee. */
	marqueeAriaLabel?: string;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface LogoCloudsViewProps extends LogoCloudsProps {
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`logos`, `logoItem`, …). */
	targetAttrs?: Record<string, Record<string, string>>;
	editMode?: boolean;
}

export function LogoClouds({
	title,
	subtitle,
	marqueeAriaLabel = "Brand logos",
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: LogoCloudsViewProps) {
	const anim = animationAttrs(animation);

	return (
		<section
			{...rootAttrs}
			className={cn(rootBaseClassName, anim.className, classNames?.root)}
			style={anim.style}
		>
			<ShimmeringText
				{...targetAttrs?.title}
				aria-level={2}
				role="heading"
				className={cn(titleBaseClassName, classNames?.title)}
				text={title}
			/>

			<p
				{...targetAttrs?.subtitle}
				className={cn(subtitleBaseClassName, classNames?.subtitle)}
			>
				{subtitle}
			</p>

			<div
				{...targetAttrs?.logos}
				className={cn(logosBaseClassName, classNames?.logos)}
			>
				<Marquee aria-label={marqueeAriaLabel} className="mt-8">
					{logoCloudItems.map((item) => (
						// §2.1: one shared target id stamped on EVERY repeated
						// instance — the compiler's exact-pair selector styles
						// them uniformly.
						<div
							key={item.name}
							{...targetAttrs?.logoItem}
							className={cn(logoItemBaseClassName, classNames?.logoItem)}
						>
							<div className="flex h-20 w-full items-center justify-center px-6">
								<img
									{...targetAttrs?.logoImage}
									alt={`${item.label} logo`}
									className={cn(logoImageBaseClassName, classNames?.logoImage)}
									decoding="async"
									loading="lazy"
									src={getDeviconSource(item.name, item.variant)}
								/>
							</div>
						</div>
					))}
				</Marquee>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent"
				/>
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent"
				/>
			</div>
		</section>
	);
}
