import {DomComponent} from './dom-component'
import {RootComponent} from './root-component'
import {Custom} from './custom-component'
import {TextComponent} from './text-component'
import {Fragment} from './fragment'

export interface Props extends Object {
  key?: string
}

export type AnyComponent = DomComponent | Custom<any> | Fragment | TextComponent
export type ParentComponent = RootComponent | DomComponent | Custom<any> | Fragment
export type ElementComponent = DomComponent | TextComponent
