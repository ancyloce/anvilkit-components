# @anvilkit/code

A Puck-native semantic code block with language metadata and optional line
numbers. It renders authored code as text; it never injects it as HTML.

## Install

```sh
pnpm add @anvilkit/code @puckeditor/core
```

## Usage

```tsx
import { Code, componentConfig } from "@anvilkit/code";

export function Example() {
  return (
    <Code
      code={'const message = "Hello, AnvilKit";'}
      language="typescript"
      showLineNumbers
    />
  );
}

export const puckComponent = componentConfig;
```

The Puck config provides structured language and line-number controls,
localized labels, and stable `root` and `code` authoring targets.
