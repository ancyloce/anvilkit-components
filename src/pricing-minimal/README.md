# @anvilkit/pricing-minimal

A Puck-native pricing section block for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/pricing-minimal @anvilkit/ui @puckeditor/core
```

## Usage

```tsx
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
