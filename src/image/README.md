# @anvilkit/image

A semantic, responsive image block for Puck with alternative text, caption,
aspect-ratio, object-fit, and loading controls.

```tsx
import { Image, componentConfig } from "@anvilkit/image";

export function Example() {
  return (
    <Image
      src="/photo.jpg"
      alt="A product interface"
      caption="Built with AnvilKit"
      aspectRatio="video"
      objectFit="cover"
    />
  );
}

export const puckComponent = componentConfig;
```

The config exposes stable `root`, `media`, and `caption` authoring targets.
Its `src` prop remains compatible with Studio asset references such as
`asset://<id>`.
