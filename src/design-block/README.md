# @anvilkit/design-block

Puck-native component that embeds a Canvas Studio design as a preview asset in a Puck page. The block stores only id refs + a preview URL — the live editor surface lives in `@anvilkit/plugin-canvas-studio`, which mounts the canvas in an overlay and writes the preview back to this block on save.
