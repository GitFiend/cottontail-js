import type {DomMeta, CustomMeta} from './index'

declare global {
  declare const __DEV__: boolean
  declare const __REQ_FRAME_DEV__: boolean
  declare const __JEST__: boolean

  namespace JSX {
    interface Element extends DomMeta {}
    interface ElementClass extends CustomMeta {}
  }
}
