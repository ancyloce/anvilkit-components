// Catalogs live at the package root (outside src/) so the bundleless rslib
// build keeps them as external .json imports instead of inlining or dropping
// them — same mechanism as the ../package.json import in config.ts.
import en from "../i18n/messages/en.json" with { type: "json" };
import ja from "../i18n/messages/ja.json" with { type: "json" };
import ko from "../i18n/messages/ko.json" with { type: "json" };
import zh from "../i18n/messages/zh.json" with { type: "json" };
import type { NavbarMenuItem } from "./Navbar";

export type NavbarMessageKey = keyof typeof en;

const PACKS: Readonly<Record<string, Record<string, string>>> = { ja, ko, zh };

/**
 * PLAN-0027 §2.3 — host-injected external adapter for the `items`
 * navigation-link collection. Functions live in config
 * (factory-injected), never in props; `fetchList` must return
 * serializable items (the selected object is stored whole in props per
 * the Puck external-field docs).
 */
export interface NavbarItemsAdapter {
	fetchList: () => Promise<unknown[]>;
	mapItem?: (item: unknown) => NavbarMenuItem;
	getItemSummary?: (item: unknown) => string;
	showSearch?: boolean;
}

export interface CreateComponentConfigOptions {
	locale?: string;
	messages?: Record<string, string>;
	/** §2.3 data-source adapters. Absent → config is byte-compatible with the static export. */
	dataSources?: {
		items?: NavbarItemsAdapter;
	};
}

/** Per-key resolution: explicit overrides → locale pack → en baseline. */
export function createT(
	options?: CreateComponentConfigOptions,
): (key: NavbarMessageKey) => string {
	const pack =
		options?.locale === undefined ? undefined : PACKS[options.locale];
	const overrides = options?.messages;
	return (key) => overrides?.[key] ?? pack?.[key] ?? en[key];
}

/** Structurally compatible with @anvilkit/core's i18n RegistryEntry (no core dep). */
export const navbarI18nEntry = {
	namespace: "navbar",
	en: en as Record<string, string>,
	loadMessages: async (locale: string): Promise<Record<string, string>> =>
		PACKS[locale] ?? {},
} as const;
