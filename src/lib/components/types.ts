import {DomComponent} from './dom-component'
import {RootComponent} from './root-component'
import {CTComponent} from './custom-component'
import {TextComponent} from './text-component'

export interface Props extends Object {
  key?: string
}

export type AnyComponent = DomComponent | CTComponent<any, any> | TextComponent
export type ParentComponent = RootComponent | DomComponent | CTComponent<any, any>
export type ElementComponent = DomComponent | TextComponent
