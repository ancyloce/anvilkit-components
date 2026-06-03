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

## Examples

### Basic usage

Render the grid with the bundled example posts via `defaultProps`.

```tsx
import "@anvilkit/blog-list/styles.css";
import { BlogList, defaultProps } from "@anvilkit/blog-list";

export function Example() {
  return <BlogList posts={defaultProps.posts} />;
}
```

### Custom posts with external links

Each post renders a cover image, a published date (with an optional relative
label), a title, and a description. Set `href` to make the card a link;
`openInNewTab` adds `target="_blank"` plus safe `rel` attributes.

```tsx
import { BlogList } from "@anvilkit/blog-list";

export function LatestPosts() {
  return (
    <BlogList
      posts={[
        {
          title: "Shipping faster with Anvilkit",
          description: "How we cut release time in half.",
          href: "https://blog.example.com/shipping-faster",
          openInNewTab: true,
          imageSrc: "https://images.example.com/cover.jpg",
          imageAlt: "Shipping faster",
          publishedAt: "2025-01-12",
          publishedLabel: "January 12, 2025",
          relativeLabel: "2mo ago",
        },
      ]}
    />
  );
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config`.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type BlogListProps } from "@anvilkit/blog-list";

const config: Config<{ BlogList: BlogListProps }> = {
  components: {
    BlogList: componentConfig,
  },
};
```

## API

Derived from the exported `BlogListProps` type and the Puck `fields` schema.

| Prop                     | Type             | Default              | Description                                 |
| ------------------------ | ---------------- | -------------------- | ------------------------------------------- |
| `posts`                  | `BlogListPost[]` | _(3 example posts)_  | Blog post entries.                          |
| `posts[].title`          | `string`         | `"New post"`         | Post title.                                 |
| `posts[].description`    | `string`         | —                    | Post summary.                               |
| `posts[].href`           | `string`         | `"/blog/new-post"`   | Link URL (card becomes a link when set).    |
| `posts[].openInNewTab`   | `boolean`        | `false`              | Open the link in a new tab.                 |
| `posts[].imageSrc`       | `string`         | _(Unsplash sample)_  | Cover image URL.                            |
| `posts[].imageAlt`       | `string`         | `"New post"`         | Cover image alt text.                       |
| `posts[].publishedAt`    | `string`         | `"2024-11-01"`       | ISO date string (used when no label given). |
| `posts[].publishedLabel` | `string`         | `"November 1, 2024"` | Formatted date label.                       |
| `posts[].relativeLabel`  | `string`         | `"8mo ago"`          | Relative time label shown in parentheses.   |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
