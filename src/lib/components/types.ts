import {DomComponent} from './dom-component'
import {RootComponent} from './root-component'
import {CustomComponent} from './custom-component'
import {TextComponent} from './text-component'

export interface Props extends Object {
  key?: string
}

export type AnyComponent = DomComponent | CustomComponent<any, any> | TextComponent
export type ParentComponent = RootComponent | DomComponent | CustomComponent<any, any>
export type ElementComponent = DomComponent | TextComponent
