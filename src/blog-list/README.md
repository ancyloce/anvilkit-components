# @anvilkit/blog-list

A Puck-native blog post grid with image cards, dates, and links.

## Install

```sh
pnpm add @anvilkit/blog-list @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/blog-list/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Props

| Field | Type | Description |
|-------|------|-------------|
| `posts` | array | Blog post entries |
| `posts[].title` | text | Post title |
| `posts[].description` | textarea | Post description |
| `posts[].href` | text | Link URL |
| `posts[].openInNewTab` | radio | Open link in new tab |
| `posts[].imageSrc` | text | Cover image URL |
| `posts[].imageAlt` | text | Cover image alt text |
| `posts[].publishedAt` | text | ISO date string |
| `posts[].publishedLabel` | text | Formatted date label |
| `posts[].relativeLabel` | text | Relative time label (e.g. `"8mo ago"`) |

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

// Puck config registration
const config: Config<{ BlogList: BlogListProps }> = {
  components: {
    BlogList: componentConfig,
  },
};

// Standalone usage
export function Example() {
  return <BlogList posts={defaultProps.posts} />;
}
```

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
