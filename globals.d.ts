import type {DomMeta, CustomMeta} from './src/create-element'
import {CustomComponent} from './src/lib/component'

declare global {
  declare const __DEV__: boolean
  declare const __REQ_FRAME_DEV__: boolean

  namespace JSX {
    interface Element extends DomMeta {}
    interface ElementClass extends CustomMeta {}
  }

  // namespace React {
  //   interface Component extends any {}
  // }
}
