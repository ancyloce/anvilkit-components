# @anvilkit/design-block

Puck-native component that embeds a Canvas Studio design as a preview asset in a Puck page. The block stores only id refs + a preview URL — the live editor surface lives in `@anvilkit/plugin-canvas-studio`, which mounts the canvas in an overlay and writes the preview back to this block on save.

## Install

```sh
pnpm add @anvilkit/design-block @puckeditor/core
```

## Styles

The package imports its stylesheet as a side effect of the entry, and also
exposes it for explicit import.

```tsx
import "@anvilkit/design-block/styles.css";
```

In Next.js, add the import to `app/layout.tsx` or `pages/_app.tsx`.

## Examples

### Render a design preview

Pass a `previewUrl` (and an `aspectRatio` to lock the frame). With a preview the
block renders an image; without one it shows a placeholder.

```tsx
import "@anvilkit/design-block/styles.css";
import { DesignBlock } from "@anvilkit/design-block";

export function Example() {
  return (
    <DesignBlock
      designId="design_123"
      previewUrl="https://cdn.example.com/previews/design_123.png"
      alt="Landing hero design"
      aspectRatio="16/9"
    />
  );
}
```

### Empty state

With no `previewUrl`, the block renders a dashed placeholder. In edit mode it
invites the author to open the canvas editor.

```tsx
import { DesignBlock } from "@anvilkit/design-block";

export function EmptyState() {
  return <DesignBlock designId="design_new" aspectRatio="4/3" />;
}
```

### Register in a Puck config (with the canvas plugin)

Wire the exported `componentConfig` into a Puck `Config`. To make the block
editable, pair it with `@anvilkit/plugin-canvas-studio`, which mounts the canvas
overlay and patches `previewUrl` / `previewAssetId` back onto the block on save.

```tsx
import type { Config } from "@puckeditor/core";
import { componentConfig, type DesignBlockProps } from "@anvilkit/design-block";

const config: Config<{ DesignBlock: DesignBlockProps }> = {
  components: {
    DesignBlock: componentConfig,
  },
};
```

## API

Derived from the exported `DesignBlockProps` type and the Puck `fields` schema.

| Prop             | Type                                       | Default                   | Description                                                                                    |
| ---------------- | ------------------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------------- |
| `designId`       | `string`                                   | `""`                      | Canvas design id this block references.                                                        |
| `previewUrl`     | `string`                                   | `""`                      | Rendered preview image URL; empty shows a placeholder.                                         |
| `previewAssetId` | `string`                                   | `""`                      | Asset id of the stored preview (set by the plugin).                                            |
| `artboardId`     | `string`                                   | `""`                      | Selected artboard; a select appears when a host catalog is registered, otherwise a text input. |
| `alt`            | `string`                                   | `"Canvas design preview"` | Preview image alt text.                                                                        |
| `aspectRatio`    | `"auto"` \| `"16/9"` \| `"4/3"` \| `"1/1"` | `"auto"`                  | Frame aspect ratio.                                                                            |

## Theme & Responsiveness

Supports light and dark themes via shadcn CSS variable tokens. The preview frame is fluid and responsive across mobile, tablet, and desktop breakpoints.
