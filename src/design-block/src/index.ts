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
	createComponentConfig,
	createDesignBlockConfig,
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
export {
	type CreateComponentConfigOptions,
	type DesignBlockMessageKey,
	designBlockI18nEntry,
} from "./i18n";
// NOTE: `DesignBlockEditPortal` is intentionally NOT re-exported here. It
// imports the Puck editor runtime (`registerOverlayPortal` → @dnd-kit), so a
// static re-export would pull that browser-only graph into every consumer of
// this barrel (and crash RSC/SSR at module load). `DesignBlock` lazy-loads it
// in edit mode instead.
export {
	CANVAS_OPEN_EVENT,
	dispatchOpenCanvas,
	type OpenCanvasDetail,
} from "./open-canvas-event";
