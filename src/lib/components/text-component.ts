import {DomComponent} from './dom-component'
import {ParentComponent} from './types'
import {RootComponent} from './root-component'
import {Order} from '../render/order'

export interface TextComponent {
  readonly kind: 'text'
  readonly element: Text
  order: string
  key: string
  meta: string
  index: number
  domParent: DomComponent | RootComponent
}

function constructText(
  meta: string,
  parent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
): TextComponent {
  const c: TextComponent = {
    kind: 'text',
    element: document.createTextNode(meta),
    order: Order.key(parent.order, index),
    key: parent.key + index,
    meta,
    index,
    domParent,
  }

  Order.insert(domParent, c)

  return c
}

function reuseForNew(
  c: TextComponent,
  meta: string,
  parent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) {
  c.meta = meta
  c.key = parent.key + index
  c.order = Order.key(parent.order, index)
  c.element.data = meta
  c.domParent = domParent
  c.index = index

  Order.insert(domParent, c)
}

// TODO: Write a test to confirm the performance advantage.

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
      reuseForNew(c, meta, parent, domParent, index)
      return c
    }
    return constructText(meta, parent, domParent, index)
  }

  static add(component: TextComponent) {
    this.components.push(component)
  }
}
