# @anvilkit/section

A Puck-native section component with badge, headline, highlighted text, and description.

## Install

```sh
pnpm add @anvilkit/section @anvilkit/ui @puckeditor/core
```

## Styles

Import the package stylesheet once from your app entry before rendering the component.

```tsx
import "@anvilkit/section/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Examples

### Basic usage

Render the section with custom copy. `highlightedHeadline` is rendered with an
animated aurora gradient next to the plain `headline`.

```tsx
import "@anvilkit/section/styles.css";
import { Section } from "@anvilkit/section";

export function Example() {
  return (
    <Section
      badgeLabel="Scale"
      headline="Stop writing boilerplate."
      highlightedHeadline="Start building features."
      description="Your AI agent handles repetitive coding tasks."
    />
  );
}
```

### Default copy

Render the bundled marketing copy via `defaultProps`.

```tsx
import { Section, defaultProps } from "@anvilkit/section";

export function DefaultSection() {
  return <Section {...defaultProps} />;
}
```

### Register in a Puck config

Wire the exported `componentConfig` into a Puck `Config`.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type SectionProps } from "@anvilkit/section";

const config: Config<{ Section: SectionProps }> = {
  components: {
    Section: componentConfig,
  },
};
```

## API

Derived from the exported `SectionProps` type and the Puck `fields` schema.

| Prop                  | Type     | Default                                              | Description                      |
| --------------------- | -------- | ---------------------------------------------------- | -------------------------------- |
| `badgeLabel`          | `string` | `"Scale"`                                            | Shiny pill badge text.           |
| `headline`            | `string` | `"Stop writing boilerplate."`                        | Plain headline text.             |
| `highlightedHeadline` | `string` | `"Start building features."`                         | Aurora-gradient headline accent. |
| `description`         | `string` | `"Your AI agent handles repetitive coding tasks..."` | Supporting description.          |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. Responsive across mobile, tablet, and desktop breakpoints.
