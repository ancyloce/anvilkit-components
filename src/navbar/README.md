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

## Props

| Field | Type | Description |
|-------|------|-------------|
| `logo` | object | Logo configuration |
| `logo.type` | radio | `text` or `image` |
| `logo.text` | text | Display text (when type is `text`) |
| `logo.imageUrl` | text | Image URL (when type is `image`) |
| `logo.alt` | text | Alt text |
| `logo.href` | text | Link URL |
| `items` | array | Navigation menu items |
| `items[].label` | text | Menu item label |
| `items[].href` | text | Menu item link |
| `actions` | array | Action buttons |
| `actions[].label` | text | Button label |
| `actions[].href` | text | Button link |
| `actions[].variant` | select | `default`, `secondary`, `outline`, `ghost`, `link`, `destructive` |
| `actions[].size` | select | `sm`, `default`, `lg` |
| `actions[].openInNewTab` | radio | `false`, `true` |
| `actions[].disabled` | radio | `false`, `true` |
| `active` | text | Path of the currently active menu item |

## Usage

```tsx
import "@anvilkit/navbar/styles.css";
import type { Config } from "@puckeditor/core";
import {
  Navbar,
  componentConfig,
  defaultProps,
  type NavbarProps,
} from "@anvilkit/navbar";

// Puck config registration
const config: Config<{ Navbar: NavbarProps }> = {
  components: {
    Navbar: componentConfig,
  },
};

// Standalone usage
export function Example() {
  return (
    <Navbar
      logo={{ type: "text", text: "Acme", imageUrl: "", alt: "Acme", href: "/" }}
      items={[
        { label: "Overview", href: "/overview" },
        { label: "Features", href: "/features" },
      ]}
      actions={[
        {
          label: "Sign up",
          href: "/signup",
          variant: "secondary",
          size: "lg",
          openInNewTab: false,
          disabled: false,
        },
      ]}
      active="/features"
    />
  );
}
```

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints. Collapses into a hamburger menu on mobile.
