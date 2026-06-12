import { describe, expect, it } from "vitest";

type Catalog = Record<string, string>;

interface LocalizableConfig {
	label?: string;
	defaultProps?: Record<string, unknown>;
	fields: Record<string, unknown>;
	metadata: { componentSlug: string };
}

interface ConfigModule {
	componentConfig: LocalizableConfig;
	createComponentConfig: (options?: {
		locale?: string;
		messages?: Record<string, string>;
	}) => LocalizableConfig;
}

const LOCALES = ["zh", "ja", "ko"] as const;

/** defaultProps key → catalog key, for packages whose factory injects localized a11y/fallback strings. */
const A11Y_DEFAULT_PROPS: Record<string, Record<string, string>> = {
	"design-block": {
		alt: "design-block.a11y.previewAlt",
		editPortalLabel: "design-block.a11y.editPortal",
		editPromptText: "design-block.fallback.editPrompt",
		unavailableText: "design-block.fallback.unavailable",
	},
	"logo-clouds": {
		marqueeAriaLabel: "logo-clouds.a11y.marquee",
	},
	navbar: {
		brandFallbackText: "navbar.fallback.brand",
		menuCloseLabel: "navbar.a11y.closeMenu",
		menuOpenLabel: "navbar.a11y.openMenu",
		navAriaLabel: "navbar.a11y.primaryNav",
	},
};

const catalogFiles = import.meta.glob<Catalog>(
	"../src/*/i18n/messages/*.json",
	{ eager: true, import: "default" },
);
const configFiles = import.meta.glob<ConfigModule>("../src/*/src/config.ts", {
	eager: true,
});

interface PackageUnderTest {
	slug: string;
	catalogs: Record<string, Catalog>;
	config: ConfigModule;
}

const bySlug = new Map<string, PackageUnderTest>();
for (const [path, catalog] of Object.entries(catalogFiles)) {
	const match = path.match(
		/^\.\.\/src\/([^/]+)\/i18n\/messages\/([a-z]+)\.json$/,
	);
	if (!match) throw new Error(`Unexpected catalog path: ${path}`);
	const [, slug, locale] = match;
	const configPath = `../src/${slug}/src/config.ts`;
	const config = configFiles[configPath];
	if (!config) throw new Error(`No config module for catalog ${path}`);
	const entry = bySlug.get(slug) ?? { slug, catalogs: {}, config };
	entry.catalogs[locale] = catalog;
	bySlug.set(slug, entry);
}

const packages = [...bySlug.values()].sort((a, b) =>
	a.slug.localeCompare(b.slug),
);

/** Deep-clone dropping function-valued members (render, resolveFields, getItemSummary…). */
function stripFunctions(value: unknown): unknown {
	if (typeof value === "function") return undefined;
	if (Array.isArray(value)) return value.map(stripFunctions);
	if (value !== null && typeof value === "object") {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value)) {
			if (typeof v === "function") continue;
			out[k] = stripFunctions(v);
		}
		return out;
	}
	return value;
}

it("covers every component package", () => {
	const configSlugs = [
		...new Set(
			Object.keys(configFiles).flatMap(
				(path) => path.match(/^\.\.\/src\/([^/]+)\//)?.[1] ?? [],
			),
		),
	].sort();
	expect(packages.map((p) => p.slug)).toEqual(configSlugs);
	expect(packages.length).toBeGreaterThan(0);
});

describe.each(packages)("$slug", ({ slug, catalogs, config }) => {
	const en = catalogs.en;
	const labelKey = `${slug}.label`;

	it("ships en + zh + ja + ko catalogs", () => {
		expect(Object.keys(catalogs).sort()).toEqual(["en", "ja", "ko", "zh"]);
	});

	it("namespaces every key with the component slug", () => {
		expect(config.componentConfig.metadata.componentSlug).toBe(slug);
		for (const key of Object.keys(en)) {
			expect(key.startsWith(`${slug}.`)).toBe(true);
		}
	});

	it.each(LOCALES)("%s catalog keys exactly match en", (locale) => {
		expect(Object.keys(catalogs[locale]).sort()).toEqual(
			Object.keys(en).sort(),
		);
	});

	it("default factory output equals the static componentConfig", () => {
		expect(stripFunctions(config.createComponentConfig())).toEqual(
			stripFunctions(config.componentConfig),
		);
		expect(config.componentConfig.label).toBe(en[labelKey]);
	});

	it.each(LOCALES)("localizes the config label for %s", (locale) => {
		expect(config.createComponentConfig({ locale }).label).toBe(
			catalogs[locale][labelKey],
		);
	});

	it("message overrides win per key; unresolved keys fall back per key", () => {
		const overridden = config.createComponentConfig({
			locale: "zh",
			messages: { [labelKey]: "OVERRIDE" },
		});
		expect(overridden.label).toBe("OVERRIDE");
		// Non-overridden keys still resolve from the zh pack.
		expect(stripFunctions(overridden.fields)).toEqual(
			stripFunctions(config.createComponentConfig({ locale: "zh" }).fields),
		);
	});

	it("unknown locales fall back to en", () => {
		expect(
			stripFunctions(config.createComponentConfig({ locale: "fr" })),
		).toEqual(stripFunctions(config.createComponentConfig()));
	});

	const a11yProps = A11Y_DEFAULT_PROPS[slug];
	if (a11yProps) {
		it.each(LOCALES)("injects localized a11y defaultProps for %s", (locale) => {
			const localized = config.createComponentConfig({ locale });
			for (const [prop, key] of Object.entries(a11yProps)) {
				expect(localized.defaultProps?.[prop]).toBe(catalogs[locale][key]);
				expect(config.componentConfig.defaultProps?.[prop]).toBe(en[key]);
			}
		});
	}
});
