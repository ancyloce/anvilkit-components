# @anvilkit/pricing-minimal

A Puck-native pricing section block for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/pricing-minimal @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/pricing-minimal/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/pricing-minimal/styles.css";
import type { Config } from "@puckeditor/core";
import {
	componentConfig,
	defaultProps,
	PricingMinimal,
	type PricingMinimalProps,
} from "@anvilkit/pricing-minimal";

const config: Config<{
	PricingMinimal: PricingMinimalProps;
}> = {
	components: {
		PricingMinimal: componentConfig,
	},
};

export const data = {
	root: {},
	content: [
		{
			type: "PricingMinimal",
			props: {
				id: "pricing-minimal-1",
				...defaultProps,
			},
		},
	],
};

export function Example() {
	return <PricingMinimal {...defaultProps} />;
}
```
