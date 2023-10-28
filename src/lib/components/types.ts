import {DomComponent} from './dom-component'
import {RootComponent} from './root-component'
import {Component} from './custom-component'
import {TextComponent} from './text-component'

export interface Props extends Object {
  key?: string
}

export type AnyComponent = DomComponent | Component<any, any> | TextComponent
export type ParentComponent = RootComponent | DomComponent | Component<any, any>
export type ElementComponent = DomComponent | TextComponent
