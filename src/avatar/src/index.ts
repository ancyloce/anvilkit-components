import './styles.css';

export type {
  AnimationEasing,
  AnimationPreset,
  AnimationProps,
} from './authoring';
export { Avatar } from './Avatar';
export type { AvatarProps, AvatarViewProps } from './Avatar';
export {
  type AvatarAuthorableProps,
  componentConfig,
  createComponentConfig,
  createAvatarConfig,
  defaultProps,
  fields,
  metadata,
  avatarConfig,
  defaultProps as avatarDefaultProps,
  fields as avatarFields,
  metadata as avatarMetadata,
} from './config';
export {
  type CreateComponentConfigOptions,
  type AvatarMessageKey,
  avatarI18nEntry,
} from './i18n';
