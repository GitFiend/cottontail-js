import {ElementComponent} from './types'

export class RootComponent {
  order = '1'
  key = 'root'

  inserted: ElementComponent[] = []

  // key is an element, value is the previous element
  siblings = new WeakMap<Element | Text, Element | Text | null>()

  constructor(public element: HTMLElement) {}
}
