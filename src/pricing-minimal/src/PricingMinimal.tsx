import { Button as BaseButton } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";
import { Separator } from "@anvilkit/ui/separator";
import { CheckIcon, PlusIcon } from "lucide-react";
import { type AnimationProps, animationAttrs } from "./authoring";

export interface PricingFeature {
	label: string;
}

export interface PricingPlan {
	name: string;
	description: string;
	price: string;
	billingPeriodLabel: string;
	ctaLabel: string;
	ctaHref?: string;
	ctaOpenInNewTab?: boolean;
	featured?: boolean;
	badgeLabel?: string;
	features: PricingFeature[];
	extraFeatures?: PricingFeature[];
}

export interface PricingMinimalProps {
	headline: string;
	description: string;
	plans: PricingPlan[];
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface PricingMinimalViewProps extends PricingMinimalProps {
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`plans`, `card`, …). */
	targetAttrs?: Record<string, Record<string, string>>;
	editMode?: boolean;
}

function getPlanKey(plan: PricingPlan, index: number) {
	return [plan.name, plan.price, plan.ctaLabel, index]
		.filter(Boolean)
		.join("-");
}

function PricingPlanButton({
	plan,
	editMode,
	classNames,
	targetAttrs,
}: {
	plan: PricingPlan;
	editMode: boolean;
	classNames?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}) {
	const isFeatured = Boolean(plan.featured);
	const isInteractive = Boolean(plan.ctaHref && !editMode);
	// §2.2 merge: authored classes come AFTER base classes so they win.
	const className = cn(
		"mt-7 h-11 w-full rounded-md px-4 text-sm font-semibold shadow-none",
		isFeatured
			? "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
			: "border-border bg-background text-foreground hover:bg-muted hover:text-foreground",
		classNames?.cta,
	);

	if (isInteractive) {
		return (
			<BaseButton
				{...targetAttrs?.cta}
				render={
					<a
						href={plan.ctaHref}
						target={plan.ctaOpenInNewTab ? "_blank" : undefined}
						rel={plan.ctaOpenInNewTab ? "noreferrer noopener" : undefined}
						aria-label={plan.ctaLabel}
					/>
				}
				nativeButton={false}
				variant={isFeatured ? "default" : "outline"}
				size="lg"
				className={className}
			>
				{plan.ctaLabel}
			</BaseButton>
		);
	}

	return (
		<BaseButton
			{...targetAttrs?.cta}
			type="button"
			disabled={editMode || !plan.ctaHref}
			variant={isFeatured ? "default" : "outline"}
			size="lg"
			className={className}
		>
			{plan.ctaLabel}
		</BaseButton>
	);
}

function FeatureList({
	features,
	accent = false,
	classNames,
	targetAttrs,
}: {
	features: PricingFeature[];
	accent?: boolean;
	classNames?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}) {
	if (features.length === 0) {
		return null;
	}

	return (
		<ul
			{...targetAttrs?.features}
			className={cn("space-y-4", classNames?.features)}
		>
			{features.map((feature, index) => (
				<li
					key={[feature.label, index].filter(Boolean).join("-")}
					className="flex items-start gap-3"
				>
					<span
						className={cn(
							"mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
							accent
								? "bg-primary text-primary-foreground"
								: "bg-foreground/75 text-background",
						)}
					>
						<CheckIcon aria-hidden="true" className="size-3" strokeWidth={3} />
					</span>
					<span className="text-sm font-medium text-muted-foreground">
						{feature.label}
					</span>
				</li>
			))}
		</ul>
	);
}

function FeatureDivider() {
	return (
		<div className="relative my-6">
			<Separator aria-hidden="true" className="bg-border/80" />
			<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
				<span className="flex size-6 items-center justify-center rounded-full border border-border bg-background text-foreground shadow-sm">
					<PlusIcon aria-hidden="true" className="size-3.5" strokeWidth={3} />
				</span>
			</div>
		</div>
	);
}

function PricingCard({
	plan,
	editMode,
	classNames,
	targetAttrs,
}: {
	plan: PricingPlan;
	editMode: boolean;
	classNames?: Record<string, string>;
	targetAttrs?: Record<string, Record<string, string>>;
}) {
	const isFeatured = Boolean(plan.featured);
	const badgeLabel = plan.badgeLabel?.trim();
	const extraFeatures = plan.extraFeatures ?? [];

	return (
		<article
			{...targetAttrs?.card}
			className={cn(
				"relative flex h-full flex-col rounded-[1.5rem] px-5 py-6 sm:px-6 sm:py-7",
				isFeatured
					? "border border-border bg-card shadow-sm shadow-black/5 dark:shadow-black/20"
					: "border border-transparent bg-transparent",
				classNames?.card,
			)}
		>
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<h3 className="text-[1.35rem] font-semibold tracking-tight text-foreground">
						{plan.name}
					</h3>
				</div>
				{isFeatured && badgeLabel ? (
					<span className="shrink-0 rounded-full bg-foreground px-3 py-1 text-[0.68rem] font-semibold tracking-wide text-background">
						{badgeLabel}
					</span>
				) : null}
			</div>

			<p className="mt-4 text-sm leading-6 text-muted-foreground">
				{plan.description}
			</p>

			<div className="mt-8">
				<div className="flex items-end">
					<span
						{...targetAttrs?.price}
						className={cn(
							"text-4xl font-semibold tracking-tight text-foreground sm:text-5xl",
							classNames?.price,
						)}
					>
						{plan.price}
					</span>
				</div>
				<p className="mt-1 text-sm text-muted-foreground">
					{plan.billingPeriodLabel}
				</p>
			</div>

			<PricingPlanButton
				plan={plan}
				editMode={editMode}
				classNames={classNames}
				targetAttrs={targetAttrs}
			/>

			<div className="mt-6 flex flex-1 flex-col">
				<FeatureList
					features={plan.features}
					classNames={classNames}
					targetAttrs={targetAttrs}
				/>
				{extraFeatures.length > 0 ? (
					<>
						<FeatureDivider />
						<FeatureList
							features={extraFeatures}
							accent
							classNames={classNames}
							targetAttrs={targetAttrs}
						/>
					</>
				) : null}
			</div>
		</article>
	);
}

export function PricingMinimal({
	headline,
	description,
	plans,
	classNames,
	animation,
	editMode = false,
	rootAttrs,
	targetAttrs,
}: PricingMinimalViewProps) {
	const anim = animationAttrs(animation);

	return (
		<section
			{...rootAttrs}
			className={cn(
				"bg-background py-12 sm:py-16 lg:py-20",
				anim.className,
				classNames?.root,
			)}
			style={anim.style}
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2
						{...targetAttrs?.headline}
						className={cn(
							"text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl",
							classNames?.headline,
						)}
					>
						{headline}
					</h2>
					<p
						{...targetAttrs?.description}
						className={cn(
							"mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg",
							classNames?.description,
						)}
					>
						{description}
					</p>
				</div>

				{/* §6.4: the collection target keeps a stable container even
				    with zero plans. */}
				<div
					{...targetAttrs?.plans}
					className={cn(
						"mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6",
						classNames?.plans,
					)}
				>
					{plans.map((plan, index) => (
						<PricingCard
							key={getPlanKey(plan, index)}
							plan={plan}
							editMode={editMode}
							classNames={classNames}
							targetAttrs={targetAttrs}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
