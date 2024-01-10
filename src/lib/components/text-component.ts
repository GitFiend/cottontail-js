import {DomComponent} from './dom-component'
import {ParentComponent} from './types'
import {RootComponent} from './root-component'
import {Order} from '../render/order'

// TODO: Stop exporting this an just have a function for creating it (using object pool)
// TODO: Write a test to confirm the performance advantage.
export class TextComponent {
  readonly kind = 'text' as const
  element: Text
  order: string
  key: string

  constructor(
    public meta: string,
    parent: ParentComponent,
    public domParent: DomComponent | RootComponent,
    public index: number,
  ) {
    const order = Order.key(parent.order, index)

    this.key = parent.key + index
    this.order = order
    this.element = document.createTextNode(meta)

    Order.insert(domParent, this)
  }

  reuseForNew(
    meta: string,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    this.meta = meta
    this.key = parent.key + index
    this.order = Order.key(parent.order, index)
    this.element.data = meta

    Order.insert(domParent, this)
  }
}

export class TextComponentPool {
  private static readonly components: TextComponent[] = []

  static makeTextComponent(
    meta: string,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    const c = this.components.pop()

    if (c) {
      c.reuseForNew(meta, parent, domParent, index)
      return c
    }
    return new TextComponent(meta, parent, domParent, index)
  }

  static add(component: TextComponent) {
    this.components.push(component)
  }
}
