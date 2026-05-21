export type DesignBlockAspectRatio = "auto" | "16/9" | "4/3" | "1/1";

export interface DesignBlockProps {
	designId: string;
	previewUrl?: string;
	previewAssetId?: string;
	artboardId?: string;
	alt?: string;
	aspectRatio?: DesignBlockAspectRatio;
}

export interface DesignBlockViewProps extends DesignBlockProps {
	editMode?: boolean;
}

const aspectRatioStyle: Record<DesignBlockAspectRatio, string | undefined> = {
	auto: undefined,
	"16/9": "16 / 9",
	"4/3": "4 / 3",
	"1/1": "1 / 1",
};

export function DesignBlock({
	designId,
	previewUrl,
	alt = "Canvas design preview",
	aspectRatio = "auto",
	editMode = false,
}: DesignBlockViewProps) {
	const ratio = aspectRatioStyle[aspectRatio];

	if (!previewUrl) {
		return (
			<div
				data-testid="design-block-empty"
				data-design-id={designId}
				className="flex w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 px-6 py-12 text-center text-sm text-muted-foreground"
				style={ratio ? { aspectRatio: ratio } : undefined}
			>
				{editMode
					? "Click ↗ Open Canvas in the header to design this block."
					: "Design not available."}
			</div>
		);
	}

	return (
		<figure
			data-testid="design-block"
			data-design-id={designId}
			className="m-0 w-full"
			style={ratio ? { aspectRatio: ratio } : undefined}
		>
			<img
				src={previewUrl}
				alt={alt}
				className="block h-auto w-full rounded-lg border border-border object-cover"
				loading="lazy"
				decoding="async"
			/>
		</figure>
	);
}
