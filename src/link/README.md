# @anvilkit/link

A Puck-native text link with style and size variants, secure new-tab handling,
editor-safe navigation, and executable URL-scheme rejection.

```tsx
import { Link, componentConfig } from "@anvilkit/link";

export function Example() {
  return <Link text="Read the docs" href="/docs" variant="underline" />;
}

export const puckComponent = componentConfig;
```

Allowed authored destinations are relative URLs, fragments, and
`http:`, `https:`, `mailto:`, or `tel:` URLs. The link's real anchor is
the stable `root` authoring target.
