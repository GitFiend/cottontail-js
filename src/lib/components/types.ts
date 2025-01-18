import {DomComponent} from './dom-component'
import {RootComponent} from './root-component'
import {Custom} from './custom-component'
import {TextComponent} from './text-component'
import {Meta, MetaInternal} from '../create-element'

// We extend Object instead of Record as the user provides a non-index-able type
export interface Props extends Object {
  key?: string
  // Single Meta seems to be required for when there's only one child.
  children?: Meta[] | Meta
}

export interface PropsInternal extends Record<string, unknown> {
  key?: string
  children?: MetaInternal[]
}

export type AnyComponent = DomComponent | Custom<any> | TextComponent

export type ParentComponent = RootComponent | DomComponent | Custom<any>

export type ElementComponent = DomComponent | TextComponent
