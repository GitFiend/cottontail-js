import type {DomMeta} from './src/jsx'

declare const __DEV__: boolean
declare const __REQ_FRAME_DEV__: boolean

declare global {
  namespace JSX {
    interface Element extends DomMeta {}
    interface ElementClass extends DomMeta {}
  }
}
