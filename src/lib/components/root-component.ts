import {ElementComponent} from './types'

export class RootComponent {
  order = '1'
  key = 'root'

  inserted: ElementComponent[] = []

  // TODO: Is tracking siblings like this actually faster than using dom api?
  // key is an element, value is the previous element
  siblings = new WeakMap<Element | Text, Element | Text | null>()

  namespace: 'svg' | 'dom'

  constructor(public element: HTMLElement) {
    this.namespace = element.nodeName === 'svg' ? 'svg' : 'dom'
  }
}
