import {DomComponent} from './dom-component'
import {RootComponent} from './root-component'
import {$Component} from './custom-component'
import {TextComponent} from './text-component'
import {Fragment} from './fragment'

export interface Props extends Object {
  key?: string
}

export type AnyComponent = DomComponent | $Component<any> | Fragment | TextComponent
export type ParentComponent = RootComponent | DomComponent | $Component<any> | Fragment
export type ElementComponent = DomComponent | TextComponent
