# @anvilkit/blog-list

A Puck-native blog post grid for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/blog-list @puckeditor/core
```

## Usage

```tsx
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
