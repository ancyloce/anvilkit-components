import { Button as BaseButton } from "@anvilkit/ui/button";
import { cn } from "@anvilkit/ui/lib/utils";
import { Separator } from "@anvilkit/ui/separator";
import { CheckIcon, PlusIcon } from "lucide-react";

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
}

export interface PricingMinimalViewProps extends PricingMinimalProps {
	editMode?: boolean;
}

function renderAnchor(href?: string, target?: string, rel?: string) {
	return <a href={href} target={target} rel={rel} />;
}

function getPlanKey(plan: PricingPlan, index: number) {
	return [plan.name, plan.price, plan.ctaLabel, index]
		.filter(Boolean)
		.join("-");
}

function PricingPlanButton({
	plan,
	editMode,
}: {
	plan: PricingPlan;
	editMode: boolean;
}) {
	const isFeatured = Boolean(plan.featured);
	const isInteractive = Boolean(plan.ctaHref && !editMode);
	const className = cn(
		"mt-7 h-11 w-full rounded-md px-4 text-sm font-semibold shadow-none",
		isFeatured
			? "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
			: "border-border bg-background text-foreground hover:bg-muted hover:text-foreground",
	);

	if (isInteractive) {
		return (
			<BaseButton
				render={renderAnchor(
					plan.ctaHref,
					plan.ctaOpenInNewTab ? "_blank" : undefined,
					plan.ctaOpenInNewTab ? "noreferrer noopener" : undefined,
				)}
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
}: {
	features: PricingFeature[];
	accent?: boolean;
}) {
	if (features.length === 0) {
		return null;
	}

	return (
		<ul className="space-y-4">
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
}: {
	plan: PricingPlan;
	editMode: boolean;
}) {
	const isFeatured = Boolean(plan.featured);
	const badgeLabel = plan.badgeLabel?.trim();
	const extraFeatures = plan.extraFeatures ?? [];

	return (
		<article
			className={cn(
				"relative flex h-full flex-col rounded-[1.5rem] px-5 py-6 sm:px-6 sm:py-7",
				isFeatured
					? "border border-border bg-card shadow-sm shadow-black/5 dark:shadow-black/20"
					: "border border-transparent bg-transparent",
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
					<span className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
						{plan.price}
					</span>
				</div>
				<p className="mt-1 text-sm text-muted-foreground">
					{plan.billingPeriodLabel}
				</p>
			</div>

			<PricingPlanButton plan={plan} editMode={editMode} />

			<div className="mt-6 flex flex-1 flex-col">
				<FeatureList features={plan.features} />
				{extraFeatures.length > 0 ? (
					<>
						<FeatureDivider />
						<FeatureList features={extraFeatures} accent />
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
	editMode = false,
}: PricingMinimalViewProps) {
	return (
		<section className="bg-background py-12 sm:py-16 lg:py-20">
			<div className="mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						{headline}
					</h2>
					<p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
						{description}
					</p>
				</div>

				{plans.length > 0 ? (
					<div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
						{plans.map((plan, index) => (
							<PricingCard
								key={getPlanKey(plan, index)}
								plan={plan}
								editMode={editMode}
							/>
						))}
					</div>
				) : null}
			</div>
		</section>
	);
}
