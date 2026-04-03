# @anvilkit/hero

A Puck-native marketing hero component with a striped dark backdrop, announcement pill, and dual download CTAs.

## Install

```sh
pnpm add @anvilkit/hero @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/hero/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/hero/styles.css";
import type { Config } from "@puckeditor/core";
import {
	Hero,
	componentConfig,
	defaultProps,
	type HeroProps,
} from "@anvilkit/hero";

const config: Config<{
	Hero: HeroProps;
}> = {
	components: {
		Hero: componentConfig,
	},
};

export function Example() {
	return <Hero {...defaultProps} />;
}
```
