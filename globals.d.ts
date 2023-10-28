import type {DomMeta, CustomMeta} from './src/create-element'

declare global {
  declare const __DEV__: boolean
  declare const __REQ_FRAME_DEV__: boolean

  namespace JSX {
    interface Element extends DomMeta {}
    interface ElementClass extends CustomMeta {}
  }
}
