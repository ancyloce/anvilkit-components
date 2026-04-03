# @anvilkit/helps

A Puck-native contributor CTA block for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/helps @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/helps/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/helps/styles.css";
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
