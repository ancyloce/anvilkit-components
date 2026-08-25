import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Icon } from "../src/icon/src/Icon";
import { componentConfig as imageConfig } from "../src/image/src/config";
import { Image } from "../src/image/src/Image";
import { componentConfig as linkConfig } from "../src/link/src/config";
import { Link } from "../src/link/src/Link";
import { componentConfig as videoConfig } from "../src/video/src/config";
import { Video } from "../src/video/src/Video";

describe("media and link components", () => {
	it("renders responsive image semantics and authorable caption copy", () => {
		const html = renderToStaticMarkup(
			createElement(Image, {
				src: "/photo.jpg",
				alt: "A useful description",
				caption: "Photo caption",
				aspectRatio: "square",
				objectFit: "contain",
			}),
		);

		expect(html).toContain("<figure");
		expect(html).toContain('src="/photo.jpg"');
		expect(html).toContain('alt="A useful description"');
		expect(html).toContain("aspect-square");
		expect(html).toContain("object-contain");
		expect(html).toContain("<figcaption");
		expect(imageConfig.metadata?.anvilkit?.editor?.inlineText).toEqual([
			{ id: "caption", propPath: "caption", format: "plain" },
		]);
	});

	it("keeps video autoplay opt-in and supports a captions track", () => {
		const html = renderToStaticMarkup(
			createElement(Video, {
				src: "/demo.mp4",
				title: "Product demo",
				captionsSrc: "/demo.vtt",
			}),
		);

		expect(html).toContain('aria-label="Product demo"');
		expect(html).toContain('kind="captions"');
		expect(html).not.toContain("autoplay");
		expect(videoConfig.defaultProps).toMatchObject({
			autoPlay: false,
			controls: true,
			muted: true,
		});
	});

	it("renders decorative and labelled icons accessibly", () => {
		const decorative = renderToStaticMarkup(
			createElement(Icon, { name: "sparkles" }),
		);
		const labelled = renderToStaticMarkup(
			createElement(Icon, {
				name: "heart",
				decorative: false,
				label: "Favourite",
				size: "lg",
			}),
		);

		expect(decorative).toContain('aria-hidden="true"');
		expect(labelled).toContain('role="img"');
		expect(labelled).toContain('aria-label="Favourite"');
		expect(labelled).toContain("size-8");
	});

	it("rejects executable link schemes and secures new tabs", () => {
		const unsafe = renderToStaticMarkup(
			createElement(Link, { text: "Unsafe", href: "javascript:alert(1)" }),
		);
		const external = renderToStaticMarkup(
			createElement(Link, {
				text: "Docs",
				href: "https://example.com/docs",
				openInNewTab: true,
			}),
		);

		expect(unsafe).not.toContain("javascript:");
		expect(unsafe).toContain('aria-disabled="true"');
		expect(external).toContain('target="_blank"');
		expect(external).toContain('rel="noreferrer noopener"');
		expect(linkConfig.metadata?.anvilkit?.editor?.inlineText).toEqual([
			{ id: "root", propPath: "text", format: "plain" },
		]);
	});

	it("stamps stable media targets through the Puck configs", () => {
		for (const [id, config, targets] of [
			["image-test", imageConfig, ["media", "caption"]],
			["video-test", videoConfig, ["media", "caption"]],
		] as const) {
			const html = renderToStaticMarkup(
				config.render({ ...config.defaultProps, id }) as ReturnType<
					typeof createElement
				>,
			);

			expect(html).toContain(`data-ak-node="${id}"`);
			for (const target of targets) {
				expect(html).toContain(`data-ak-style-target="${target}"`);
			}
		}
	});
});
