import {DomComponent} from './dom-component'
import {RootComponent} from './root-component'
import {CTComponent} from './custom-component'
import {TextComponent} from './text-component'

export interface Props extends Object {
  key?: string
}

export type AnyComponent = DomComponent | CTComponent<any> | TextComponent
export type ParentComponent = RootComponent | DomComponent | CTComponent<any>
export type ElementComponent = DomComponent | TextComponent
