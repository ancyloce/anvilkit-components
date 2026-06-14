import { afterEach, describe, expect, it } from "vitest";
import {
	DESIGN_PREVIEW_REFERENCE_PREFIX,
	getDesignPreview,
	getDesignPreviewSource,
	isDesignPreviewReference,
	setDesignPreviewSource,
} from "../src/design-block/src/design-preview-store";

afterEach(() => {
	setDesignPreviewSource(null);
});

describe("design preview store seam", () => {
	it("returns null when no source is registered", () => {
		expect(getDesignPreview("d1")).toBeNull();
		expect(getDesignPreviewSource()).toBeNull();
	});

	it("resolves through the registered source, forwarding the artboard id", () => {
		const calls: Array<[string, string | undefined]> = [];
		setDesignPreviewSource({
			get(designId, artboardId) {
				calls.push([designId, artboardId]);
				return artboardId
					? `blob:${designId}/${artboardId}`
					: `blob:${designId}`;
			},
		});

		expect(getDesignPreview("d1", "p1")).toBe("blob:d1/p1");
		expect(getDesignPreview("d1")).toBe("blob:d1");
		expect(calls).toEqual([
			["d1", "p1"],
			["d1", undefined],
		]);
	});

	it("treats empty design ids, empty results, and thrown sources as null", () => {
		setDesignPreviewSource({ get: () => "" });
		expect(getDesignPreview("d1")).toBeNull(); // empty string → null
		expect(getDesignPreview("")).toBeNull(); // empty id → null (source not consulted)

		setDesignPreviewSource({
			get() {
				throw new Error("boom");
			},
		});
		expect(getDesignPreview("d1")).toBeNull(); // source throw is swallowed
	});

	it("identifies `design://` references vs directly renderable URLs", () => {
		expect(DESIGN_PREVIEW_REFERENCE_PREFIX).toBe("design://");
		expect(isDesignPreviewReference("design://abc")).toBe(true);
		expect(isDesignPreviewReference("design://abc/p1")).toBe(true);
		expect(isDesignPreviewReference("data:image/png;base64,AAAA")).toBe(false);
		expect(isDesignPreviewReference("https://cdn/x.png")).toBe(false);
		expect(isDesignPreviewReference("")).toBe(false);
		expect(isDesignPreviewReference(undefined)).toBe(false);
	});
});
