# @anvilkit/bento-grid

A Puck-native Bento Grid component with adaptive mobile/tablet/desktop layouts, built-in light/dark theming, a serializable `items` API for Puck, and exported `BentoCard` primitives for direct composition.

## Install

```sh
pnpm add @anvilkit/bento-grid @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/bento-grid/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/bento-grid/styles.css";
import type { Config } from "@puckeditor/core";
import {
	BentoCard,
	BentoGrid,
	BentoGridExample,
	componentConfig,
	defaultProps,
	type BentoGridProps,
} from "@anvilkit/bento-grid";

const config: Config<{
	BentoGrid: BentoGridProps;
}> = {
	components: {
		BentoGrid: componentConfig,
	},
};

export function PuckExample() {
	return <BentoGrid {...defaultProps} theme="dark" platform="adaptive" />;
}

export function DirectCompositionExample() {
	return (
		<BentoGrid theme="light" platform="tablet">
			<BentoCard>
				<div className="flex flex-col gap-y-2 items-center">
					<h2 className="text-xl font-medium text-card-foreground text-center text-balance">
						Custom card
					</h2>
				</div>
				<p className="max-w-md mx-auto text-sm text-muted-foreground text-balance text-center">
					Use the exported BentoCard component when you want to author the cell
					content yourself.
				</p>
			</BentoCard>
		</BentoGrid>
	);
}

export function Demo() {
	return <BentoGridExample />;
}
```
