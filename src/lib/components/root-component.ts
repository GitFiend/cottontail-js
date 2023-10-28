import {AnyComponent} from './types'
import {TextComponent} from './text-component'
import {DomComponent} from './dom-component'

export class RootComponent {
  component: AnyComponent | null = null

  order = '1'
  key = 'root'

  inserted: (DomComponent | TextComponent)[] = []

  // key is an element, value is the previous element
  siblings = new WeakMap<Element | Text, Element | Text | null>()

  constructor(public element: HTMLElement) {}
}
