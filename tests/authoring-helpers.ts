/**
 * Shared harness for the PLAN-0025 Phase 3 authoring adoption suites
 * (`authoring-contract.test.ts`, `authoring-parity.test.ts`).
 *
 * `ADOPTED` is the phase ledger: each adoption batch (P3-A … P3-E)
 * appends its slugs, and the suites assert the full §6 protocol for
 * every listed package — so a package cannot claim adoption without
 * passing here. The §6.5 target matrix and the §6.1 property
 * vocabulary are mirrored as literals on purpose: these packages take
 * no `@anvilkit/contracts` dependency (self-containment precedent),
 * and the superproject's compiler tests own the authoritative copies.
 */

export const ADOPTED: readonly string[] = [
	"bento-grid",
	"blog-list",
	"button",
	"design-block",
	"helps",
	"hero",
	"input",
	"logo-clouds",
	"navbar",
	"pricing-minimal",
	"section",
	"statistics",
];

/** §6.5 minimum required targets per component slug. */
export const REQUIRED_TARGETS: Readonly<Record<string, readonly string[]>> = {
	button: ["root"],
	input: ["root", "control", "label"],
	section: ["root", "content"],
	"bento-grid": ["root", "items"],
	// §6.5 deviation, confirmed against the real DOM: Hero renders no
	// media element anywhere, so no `media` target exists to declare —
	// an empty fabricated container would violate §8.5.
	hero: ["root", "content", "actions"],
	navbar: ["root", "links", "actions"],
	"pricing-minimal": ["root", "plans"],
	// §6.5 deviation: the view renders only the title + decorative
	// grid — metrics produce no DOM, so no items target exists.
	statistics: ["root"],
	helps: ["root", "content"],
	// §6.5 deviation: the posts grid IS the root section in both
	// render branches — no separate list container exists. PLAN-0027 P1
	// added the card-level and text-level targets (stamped on every
	// card instance in both the <a> and <div> card branches).
	"blog-list": [
		"root",
		"card",
		"cardImage",
		"cardMeta",
		"cardTitle",
		"cardDescription",
	],
	"logo-clouds": ["root", "logos"],
	"design-block": ["root", "canvas"],
};

/** §6.1 grantable property vocabulary (mirror of the contracts union). */
export const AUTHORABLE_PROPERTIES: readonly string[] = [
	"display",
	"position",
	"width",
	"minWidth",
	"maxWidth",
	"height",
	"margin",
	"padding",
	"gap",
	"alignItems",
	"justifyContent",
	"background",
	"border",
	"borderRadius",
	"boxShadow",
	"opacity",
	"color",
	"fontFamily",
	"fontSize",
	"fontWeight",
	"lineHeight",
	"letterSpacing",
	"textAlign",
];

/** Labels accepted by the PLAN-0027 §2.4 `animationField` helper. */
export interface AnimationFieldLabelsShape {
	label: string;
	preset: string;
	presetOptions: Record<string, string>;
	duration: string;
	delay: string;
	easing: string;
}

export interface AuthoringModule {
	appearanceField: Record<string, unknown>;
	interactionsField: Record<string, unknown>;
	bindingsField: Record<string, unknown>;
	anvilRootAttrs: (id: string, target?: string) => Record<string, string>;
	anvilTargetAttrs: (id: string, target: string) => Record<string, string>;
	// PLAN-0027 §2.5 surface — optional until the P2 fan-out lands the
	// verbatim copy in every package; the contract suite enforces
	// all-or-nothing presence plus one structural shape.
	classNamesField?: (
		targets: readonly { id: string; label: string }[],
		label?: string,
	) => Record<string, unknown>;
	animationField?: (
		labels: AnimationFieldLabelsShape,
	) => Record<string, unknown>;
	animationAttrs?: (animation?: {
		preset: string;
		durationMs?: number;
		delayMs?: number;
		easing?: string;
	}) => { className?: string; style?: Record<string, string> };
}

export interface AdoptedConfigModule {
	componentConfig: {
		fields: Record<string, unknown>;
		defaultProps: Record<string, unknown>;
		metadata: Record<string, unknown> & {
			componentSlug: string;
			anvilkit?: {
				editor?: {
					version?: string;
					styleTargets?: Record<
						string,
						{
							label?: unknown;
							properties?: unknown;
							responsive?: unknown;
						}
					>;
				};
			};
		};
		render: (props: Record<string, unknown>) => unknown;
		/** PLAN-0027 §2.3: never present on the static config. */
		resolveData?: unknown;
	};
	/** Locale/adapter factory — part of every package's export contract. */
	createComponentConfig: (
		options?: Record<string, unknown>,
	) => AdoptedConfigModule["componentConfig"];
}

const configModules = import.meta.glob<AdoptedConfigModule>(
	"../src/*/src/config.ts",
	{ eager: true },
);
const authoringModules = import.meta.glob<AuthoringModule>(
	"../src/*/src/authoring.ts",
	{ eager: true },
);

export function configOf(slug: string): AdoptedConfigModule {
	const module = configModules[`../src/${slug}/src/config.ts`];
	if (!module) throw new Error(`no config module for adopted slug "${slug}"`);
	return module;
}

export function authoringOf(slug: string): AuthoringModule {
	const module = authoringModules[`../src/${slug}/src/authoring.ts`];
	if (!module)
		throw new Error(`no authoring module for adopted slug "${slug}"`);
	return module;
}

/** Every discovered authoring module path (adoption-drift check). */
export function discoveredAuthoringSlugs(): readonly string[] {
	return Object.keys(authoringModules)
		.map((path) => {
			const match = path.match(/^\.\.\/src\/([^/]+)\/src\/authoring\.ts$/);
			if (!match) throw new Error(`unexpected authoring path: ${path}`);
			return match[1] as string;
		})
		.sort();
}
