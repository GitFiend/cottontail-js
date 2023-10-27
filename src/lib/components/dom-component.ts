import {DomMeta, MetaKind} from '../../create-element'
import {RootComponent} from './root-component'
import {ElementNamespace, setAttributesFromProps} from '../set-attributes'
import {renderTree} from '../render'
import {Component, ElementComponent, ParentComponent} from './types'
import {Order} from '../order'

export class DomComponent {
  element: HTMLElement
  kind = MetaKind.dom as const

  order: string
  key: string

  subComponents: Component[] = []

  inserted: ElementComponent[] = []

  // key is an element, value is the previous element
  siblings = new WeakMap<Element | Text, Element | Text | null>()

  constructor(
    public meta: DomMeta,
    public parent: ParentComponent,
    public domParent: DomComponent | RootComponent,
    public index: number,
  ) {
    this.order = Order.key(parent.order, index)
    this.key = meta.props?.key ?? parent.key + index
    this.element = document.createElement(meta.name)

    // TODO: Test this
    if (meta.props) {
      setAttributesFromProps(this.element, ElementNamespace.html, meta.props)
    }

    domParent.element.append(this.element)

    for (let i = 0; i < meta.children.length; i++) {
      const child = meta.children[i]
      renderTree(child, null, this, this, i)
    }
  }

  renderSubComponents() {}

  removeSelf() {
    this.domParent.element.removeChild(this.element)

    for (const c of this.subComponents) {
      c.removeSelf()
    }
    this.subComponents.length = 0
  }
}
