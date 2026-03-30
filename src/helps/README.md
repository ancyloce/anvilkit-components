# @anvilkit/helps

A Puck-native contributor CTA block for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/helps @anvilkit/ui @puckeditor/core
```

## Usage

```tsx
import type { Config } from "@puckeditor/core";
import {
	Helps,
	componentConfig,
	defaultProps,
	type HelpsProps,
} from "@anvilkit/helps";

const config: Config<{
	Helps: HelpsProps;
}> = {
	components: {
		Helps: componentConfig,
	},
};

export const data = {
	root: {},
	content: [
		{
			type: "Helps",
			props: {
				id: "helps-1",
				...defaultProps,
			},
		},
	],
};

export function Example() {
	return <Helps {...defaultProps} />;
}
```
