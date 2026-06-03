# @anvilkit/navbar

A Puck-native navbar layout component with logo, navigation items, and action buttons.

## Install

```sh
pnpm add @anvilkit/navbar @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/navbar/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Examples

### Basic usage

A text logo, a few links, and a single call-to-action. The `active` href
highlights the matching menu item.

```tsx
import "@anvilkit/navbar/styles.css";
import { Navbar } from "@anvilkit/navbar";

export function Example() {
  return (
    <Navbar
      logo={{ type: "text", text: "Acme", href: "/" }}
      items={[
        { label: "Overview", href: "/overview" },
        { label: "Features", href: "/features" },
      ]}
      actions={[{ label: "Sign up", href: "/signup", variant: "secondary" }]}
      active="/features"
    />
  );
}
```

### Image logo with multiple actions

Switch the logo to `image`, and render several actions with different variants
and sizes.

```tsx
import { Navbar } from "@anvilkit/navbar";

export function MarketingNav() {
  return (
    <Navbar
      logo={{ type: "image", imageUrl: "/logo.svg", alt: "Acme", href: "/" }}
      items={[
        { label: "Product", href: "/product" },
        { label: "Pricing", href: "/pricing" },
      ]}
      actions={[
        { label: "Log in", href: "/login", variant: "ghost", size: "default" },
        {
          label: "Get started",
          href: "/signup",
          variant: "default",
          size: "lg",
        },
      ]}
      active="/pricing"
    />
  );
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config`.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type NavbarProps } from "@anvilkit/navbar";

const config: Config<{ Navbar: NavbarProps }> = {
  components: {
    Navbar: componentConfig,
  },
};
```

## API

Derived from the exported `NavbarProps` type and the Puck `fields` schema.

| Prop                     | Type                                                                                    | Default              | Description                          |
| ------------------------ | --------------------------------------------------------------------------------------- | -------------------- | ------------------------------------ |
| `logo`                   | `object`                                                                                | _(text logo)_        | Logo configuration.                  |
| `logo.type`              | `"text"` \| `"image"`                                                                   | `"text"`             | Render the logo as text or an image. |
| `logo.text`              | `string`                                                                                | `"Underline"`        | Display text (when type is `text`).  |
| `logo.imageUrl`          | `string`                                                                                | `""`                 | Image URL (when type is `image`).    |
| `logo.alt`               | `string`                                                                                | `"Underline"`        | Image alt text.                      |
| `logo.href`              | `string`                                                                                | `"/"`                | Logo link URL.                       |
| `items`                  | `NavbarMenuItem[]`                                                                      | _(5 example links)_  | Navigation menu items.               |
| `items[].label`          | `string`                                                                                | `"New link"`         | Menu item label.                     |
| `items[].href`           | `string`                                                                                | `"/"`                | Menu item link.                      |
| `actions`                | `NavbarAction[]`                                                                        | _(1 example action)_ | Action buttons.                      |
| `actions[].label`        | `string`                                                                                | `"Action"`           | Button label.                        |
| `actions[].href`         | `string`                                                                                | `""`                 | Button link.                         |
| `actions[].variant`      | `"default"` \| `"secondary"` \| `"outline"` \| `"ghost"` \| `"link"` \| `"destructive"` | `"secondary"`        | Button variant.                      |
| `actions[].size`         | `"sm"` \| `"default"` \| `"lg"`                                                         | `"lg"`               | Button size.                         |
| `actions[].openInNewTab` | `boolean`                                                                               | `false`              | Open the link in a new tab.          |
| `actions[].disabled`     | `boolean`                                                                               | `false`              | Disable the action button.           |
| `active`                 | `string`                                                                                | `"/features"`        | Href of the currently active item.   |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints. Collapses into a hamburger menu on mobile.
