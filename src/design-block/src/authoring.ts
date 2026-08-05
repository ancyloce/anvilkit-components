/**
 * Puck-native authoring surface (PLAN-0025 §5.3/§6.2) — self-contained
 * per package, like `i18n.ts`: component packages deliberately take no
 * `@anvilkit/core`/`@anvilkit/contracts` dependency, so the hidden
 * authoring fields and target-attribute helpers live here verbatim.
 * The workspace suite `tests/authoring-contract.test.ts` locks every
 * package's copy to one structural shape and to the exact attribute
 * literals the AnvilKit compiler selects on — divergence fails CI, so
 * self-containment cannot drift into incompatible variants.
 *
 * The authoring carriers are `unknown`-typed here on purpose: the
 * component never reads them (the shared compiler owns CSS
 * materialization), and the authoritative types/schemas live in
 * `@anvilkit/contracts` + `@anvilkit/schema`, enforced by the Studio
 * write path before anything lands in these props.
 */

import type { CustomField } from "@puckeditor/core";
import { createElement, type ReactElement } from "react";

/** §5.1 node authoring carriers, attached to every authorable component. */
export interface AuthoringFeatureProps {
	readonly appearance?: unknown;
	readonly interactions?: readonly unknown[];
	readonly bindings?: readonly unknown[];
}

/** Business props + the §5.1 authoring carriers. */
export type AuthorableProps<T extends object> = T & AuthoringFeatureProps;

// Puck 0.22.4 erratum (locked upstream): `CustomFieldRender` must
// return a ReactElement, so hidden fields render an empty element.
const renderHidden = (): ReactElement =>
	createElement("span", { hidden: true });

/** Hidden declared field for `props.appearance` (§5.3). */
export const appearanceField: CustomField<unknown> = {
	type: "custom",
	visible: false,
	render: renderHidden,
};

/** Hidden declared field for `props.interactions` (§5.3). */
export const interactionsField: CustomField<readonly unknown[] | undefined> = {
	type: "custom",
	visible: false,
	render: renderHidden,
};

/** Hidden declared field for `props.bindings` (§5.3). */
export const bindingsField: CustomField<readonly unknown[] | undefined> = {
	type: "custom",
	visible: false,
	render: renderHidden,
};

/** The three §5.3 fields, spreadable into a config's `fields`. */
export const authoringFields = {
	appearance: appearanceField,
	interactions: interactionsField,
	bindings: bindingsField,
} as const;

/** Root target attributes (§6.2): stamped on the component's root element. */
export function anvilRootAttrs(id: string, target = "root") {
	return {
		"data-ak-node": id,
		"data-ak-style-node": id,
		"data-ak-style-target": target,
	} as const;
}

/** Named-target attributes (§6.2): exact pairs, never descendant selectors. */
export function anvilTargetAttrs(id: string, target: string) {
	return {
		"data-ak-style-node": id,
		"data-ak-style-target": target,
	} as const;
}
