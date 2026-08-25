# @anvilkit/video

An accessible Puck video block with poster, captions, playback, and
aspect-ratio controls. Autoplay is off by default.

```tsx
import { Video, componentConfig } from "@anvilkit/video";

export function Example() {
  return (
    <Video
      src="/demo.mp4"
      title="Product walkthrough"
      captionsSrc="/demo.vtt"
      controls
    />
  );
}

export const puckComponent = componentConfig;
```

The config exposes stable `root`, `media`, and `caption` authoring targets.
