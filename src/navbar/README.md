# @anvilkit/navbar

A Puck-native navbar layout component for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/navbar @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/navbar/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`. If you use multiple `@anvilkit/*` component packages, import each package stylesheet in that same entry file.

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

const config: Config<{
  Navbar: NavbarProps;
}> = {
  components: {
    Navbar: componentConfig,
  },
};

export const data = {
  root: {},
  content: [
    {
      type: "Navbar",
      props: {
        id: "navbar-1",
        ...defaultProps,
      },
    },
  ],
};

export function Example() {
  return (
    <Navbar
      logo={{ type: "text", text: "Underline", href: "/" }}
      logoNode={<span className="text-lg font-semibold">Underline</span>}
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
