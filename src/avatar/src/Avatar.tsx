import {
	AvatarFallback,
	AvatarImage,
	Avatar as BaseAvatar,
} from "@anvilkit/ui/avatar";
import { cn } from "@anvilkit/ui/lib/utils";
import { type AnimationProps, animationAttrs } from "./authoring";
import type { Size } from "./generated/fields.gen";

export interface AvatarProps {
	src?: string;
	alt?: string;
	fallback?: string;
	/** shadcn size axis, derived by `scripts/derive-shadcn-fields.mjs`. */
	size?: Size;
	/** §2.2 Tailwind passthrough (PLAN-0027): style-target id → authored classes. */
	classNames?: Record<string, string>;
	/** §2.4 entrance animation (PLAN-0027), applied to the root element. */
	animation?: AnimationProps;
}

export interface AvatarViewProps extends AvatarProps {
	editMode?: boolean;
	/**
	 * Stable §6.2 root-target attributes stamped by the config adapter
	 * in EVERY mode (PLAN-0025).
	 */
	rootAttrs?: Record<string, string>;
	/** Named-target attributes keyed by target id (`fallback`). */
	targetAttrs?: Record<string, Record<string, string>>;
}

/**
 * `@anvilkit/ui` avatar (DOC-01 §5.13). The fallback always renders —
 * base-ui shows it whenever the image is absent or fails — so it is a
 * real, unconditional target. `AvatarBadge`/`AvatarGroup`/
 * `AvatarGroupCount` are excluded in v1 (DOC-01 OPEN-3).
 *
 * Non-interactive — nothing to make inert for `editMode`.
 */
export function Avatar({
	src,
	alt,
	fallback,
	size = "default",
	classNames,
	animation,
	rootAttrs,
	targetAttrs,
}: AvatarViewProps) {
	const anim = animationAttrs(animation);

	return (
		<BaseAvatar
			{...rootAttrs}
			size={size}
			className={cn(anim.className, classNames?.root)}
			style={anim.style}
		>
			{src ? <AvatarImage src={src} alt={alt} /> : null}
			<AvatarFallback
				{...targetAttrs?.fallback}
				className={classNames?.fallback}
			>
				{fallback}
			</AvatarFallback>
		</BaseAvatar>
	);
}
