import {DomMeta, MetaKind} from '../../create-element'
import {RootComponent} from './root-component'
import {ElementNamespace, setAttributesFromProps} from '../set-attributes'
import {Component, ParentComponent} from './custom-component'

export class DomComponent {
  element: HTMLElement
  kind = MetaKind.dom as const

  subComponents: Component[] = []

  constructor(
    public meta: DomMeta,
    public parent: ParentComponent,
    public domParent: DomComponent | RootComponent,
  ) {
    this.element = document.createElement(meta.name)

    // TODO: Test this
    if (meta.props) {
      setAttributesFromProps(this.element, ElementNamespace.html, meta.props)
    }

    domParent.element.append(this.element)
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
