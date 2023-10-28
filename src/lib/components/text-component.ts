import {DomComponent} from './dom-component'
import {ParentComponent} from './types'
import {RootComponent} from './root-component'
import {MetaKind} from '../../create-element'
import {Order} from '../render/order'

export class TextComponent {
  kind = MetaKind.text as const
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

    domParent.element.append(this.element)
  }

  // removeSelf() {
  //   // TODO
  // }
}