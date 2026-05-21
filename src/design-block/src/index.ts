import "./styles.css";

export type {
	ArtboardCatalogEntry,
	ArtboardCatalogFn,
} from "./artboard-catalog";
export {
	getArtboardCatalog,
	listArtboards,
	setArtboardCatalog,
} from "./artboard-catalog";
export {
	componentConfig,
	componentConfig as designBlockComponentConfig,
	defaultProps,
	defaultProps as designBlockDefaultProps,
	designBlockConfig,
	fields,
	fields as designBlockFields,
	metadata,
	metadata as designBlockMetadata,
} from "./config";
export type {
	DesignBlockAspectRatio,
	DesignBlockProps,
	DesignBlockViewProps,
} from "./DesignBlock";
export { DesignBlock } from "./DesignBlock";
