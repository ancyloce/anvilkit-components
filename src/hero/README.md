# @anvilkit/hero

A Puck-native marketing hero component with a striped dark backdrop, announcement pill, and dual download CTAs.

## Install

```sh
pnpm add @anvilkit/hero @anvilkit/ui @puckeditor/core
```

## Usage

```tsx
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
