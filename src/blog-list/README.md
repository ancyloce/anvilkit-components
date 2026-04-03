# @anvilkit/blog-list

A Puck-native blog post grid for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/blog-list @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/blog-list/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

## Usage

```tsx
import "@anvilkit/blog-list/styles.css";
import type { Config } from "@puckeditor/core";
import {
	BlogList,
	componentConfig,
	defaultProps,
	type BlogListProps,
} from "@anvilkit/blog-list";

const config: Config<{
	BlogList: BlogListProps;
}> = {
	components: {
		BlogList: componentConfig,
	},
};

export const data = {
	root: {},
	content: [
		{
			type: "BlogList",
			props: {
				id: "blog-list-1",
				...defaultProps,
			},
		},
	],
};

export function Example() {
	return <BlogList posts={defaultProps.posts} />;
}
```
