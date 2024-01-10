import {DomComponent} from './dom-component'
import {RootComponent} from './root-component'
import {Custom} from './custom-component'
import {TextComponent} from './text-component'
import {Fragment} from './fragment'
import {Meta} from '../create-element'

export interface Props extends Object {
  key?: string
  // Single Meta seems to be required for when there's only one child.
  children?: Meta[] | Meta
}

export interface PropsInternal extends Record<string, unknown> {
  key?: string
  children?: Meta[]
}

export type AnyComponent = DomComponent | Custom<any> | Fragment | TextComponent
export type ParentComponent =
  | RootComponent
  | DomComponent
  | Custom<any>
  | Fragment
export type ElementComponent = DomComponent | TextComponent
