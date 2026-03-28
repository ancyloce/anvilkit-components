# @anvilkit/navbar

A Puck-native navbar layout component for `anvilkit-components`.

## Install

```sh
pnpm add @anvilkit/navbar @anvilkit/ui @puckeditor/core
```

## Usage

```tsx
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
