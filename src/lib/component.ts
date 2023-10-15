import {CustomMeta, DomMeta, MetaKind} from '../jsx'
import {ElementNamespace, setAttributesFromProps} from './set-attributes'

interface BaseProps {
  key?: string
}

export interface Props extends BaseProps {
  [name: string]: unknown
}

export type Component = DomComponent | CustomComponent
export type ParentComponent = RootComponent | DomComponent | CustomComponent

export class RootComponent {
  component: Component | null = null

  constructor(public element: HTMLElement) {}
}

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
  }

  renderSubComponents() {}

  removeSelf() {
    this.domParent.element.removeChild(this.element)
  }
}

export class CustomComponent {
  subComponents: Component[] = []
  kind = MetaKind.custom as const

  constructor(
    public meta: CustomMeta,
    public parent: ParentComponent,
    public domParent: DomComponent | RootComponent,
  ) {}

  renderSubComponents() {}

  removeSelf() {}
}
