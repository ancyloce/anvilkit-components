// Catalogs live at the package root (outside src/) so the bundleless rslib
// build keeps them as external .json imports instead of inlining or dropping
// them — same mechanism as the ../package.json import in config.ts.
import en from '../i18n/messages/en.json' with { type: 'json' };
import ja from '../i18n/messages/ja.json' with { type: 'json' };
import ko from '../i18n/messages/ko.json' with { type: 'json' };
import zh from '../i18n/messages/zh.json' with { type: 'json' };

export type CheckboxMessageKey = keyof typeof en;

const PACKS: Readonly<Record<string, Record<string, string>>> = { ja, ko, zh };

export interface CreateComponentConfigOptions {
  locale?: string;
  messages?: Record<string, string>;
}

/** Per-key resolution: explicit overrides → locale pack → en baseline. */
export function createT(
  options?: CreateComponentConfigOptions,
): (key: CheckboxMessageKey) => string {
  const pack =
    options?.locale === undefined ? undefined : PACKS[options.locale];
  const overrides = options?.messages;
  return (key) => overrides?.[key] ?? pack?.[key] ?? en[key];
}

/** Structurally compatible with @anvilkit/core's i18n RegistryEntry (no core dep). */
export const checkboxI18nEntry = {
  namespace: 'checkbox',
  en: en as Record<string, string>,
  loadMessages: async (locale: string): Promise<Record<string, string>> =>
    PACKS[locale] ?? {},
} as const;
