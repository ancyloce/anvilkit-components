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
	"accordion",
	"alert",
	"avatar",
	"badge",
	"bento-grid",
	"blog-list",
	"button",
	"card",
	"checkbox",
	"design-block",
	"helps",
	"hero",
	"input",
	"label",
	"logo-clouds",
	"navbar",
	"pricing-minimal",
	"progress",
	"section",
	"select",
	"separator",
	"slider",
	"statistics",
	"switch",
	"table",
	"tabs",
	"textarea",
	"tooltip",
];

/** §6.5 minimum required targets per component slug. */
export const REQUIRED_TARGETS: Readonly<Record<string, readonly string[]>> = {
	button: ["root"],
	// Real-DOM: the wrapper renders exactly one `@anvilkit/ui` span with
	// `label` as a bare text child — no inner element to stamp.
	badge: ["root"],
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
	// Real-DOM: a single base-ui rule element with no children at all.
	separator: ["root"],
	// §6.5 deviation: base-ui's `Select.Root` renders no DOM, so the
	// trigger is the outermost real element; the popup is portal'd.
	select: ["root"],
	// The two slot regions always render (Puck contract rule 3: identical
	// DOM across editor/preview/publish/export); title and description are
	// conditional on their props but real DOM whenever present.
	card: ["root", "title", "description", "content", "footer"],
	// DOC-01 §5.7: a bare auto-sizing `<textarea>` — labelling composes via
	// the `label` package, so there is no second element to stamp.
	textarea: ["root"],
	// §5.8: one `<label>` carrying its text as a bare child.
	label: ["root"],
	// §5.9/§5.10: the upstream primitives are bare controls with no label
	// of their own, so these wrappers own the flex row and the `htmlFor`
	// pairing — root/control/label are all real wrapper DOM. `label` is
	// conditional on its prop, the same allowance card's title carries.
	checkbox: ["root", "control", "label"],
	switch: ["root", "control", "label"],
	// §5.11/§5.12: base-ui renders its own track/indicator/thumb parts;
	// the wrapper adds no DOM of its own, so root is the whole map.
	slider: ["root"],
	progress: ["root"],
	// §5.13: the base-ui circle plus the fallback initials, which render
	// whenever the image is absent or fails. The image is excluded — it is
	// branch-conditional on `src`.
	avatar: ["root", "fallback"],
	// §5.14: the cva container plus both text parts. `description` is
	// conditional on its prop, the same allowance card's carry.
	alert: ["root", "title", "description"],
	// §5.15: DOC-01 left `root` conditional on the render introducing a
	// trigger wrapper — it does (a real <span>). The popup is portal'd and
	// never renders in the canvas, so it is deliberately not a target.
	tooltip: ["root"],
	// §5.16/§5.17: every panel is `keepMounted`, so the list/trigger/panel
	// parts exist in EVERY mode — the open/closed state is an affordance,
	// not a structural difference.
	tabs: ["root", "list", "trigger", "content"],
	// `content` is absent by design — see the note in accordion/src/config.ts.
	accordion: ["root", "item", "trigger"],
	// §5.18: the scroll container plus header/row/cell; `caption` is
	// conditional on its prop, the same allowance card's carry.
	table: ["root", "header", "row", "cell", "caption"],
};

/**
 * §6.1 grantable property vocabulary (mirror of the contracts union
 * `AuthorableStyleProperty` in
 * `packages/foundation/contracts/src/editor/component-metadata.ts`).
 *
 * Widened 23 -> 40 by `p1-004` (ED-FA-001, ADR 0007 decision 5); this
 * literal copy was synced by `p6-003`, which is the task that first
 * grants any of the added 17. The assertion this feeds is unchanged —
 * a target may still grant nothing outside the vocabulary — only the
 * vocabulary itself moved. Keep the order identical to the union so a
 * future widening is a mechanical diff.
 */
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
	"direction",
	"wrap",
	"rowGap",
	"columnGap",
	"columns",
	"rows",
	"minHeight",
	"maxHeight",
	"inset",
	"overflow",
	"zIndex",
	"filter",
	"blendMode",
	"cursor",
	"textDecoration",
	"textTransform",
	"textWrap",
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
