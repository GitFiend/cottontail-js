import {AnyComponent, ElementComponent} from './types'

export class RootComponent {
  component: AnyComponent | null = null

  order = '1'
  key = 'root'

  inserted: ElementComponent[] = []

  // key is an element, value is the previous element
  siblings = new WeakMap<Element | Text, Element | Text | null>()

  constructor(public element: HTMLElement) {}
}
