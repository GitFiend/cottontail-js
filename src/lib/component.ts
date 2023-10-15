import {CustomMeta, DomMeta, MetaKind} from '../create-element'
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

    for (const c of this.subComponents) {
      c.removeSelf()
    }
    this.subComponents.length = 0
  }
}

export class CustomComponent {
  subComponents: Component[] = []
  kind = MetaKind.custom as const
  removed = false

  constructor(
    public meta: CustomMeta,
    public parent: ParentComponent,
    public domParent: DomComponent | RootComponent,
  ) {}

  renderSubComponents() {}

  componentDidMount(): void {}

  componentDidUpdate(): void {}

  componentWillUnmount(): void {}

  removeSelf() {
    if (__DEV__ && this.removed) {
      console.error('already removed')
    }
    this.componentWillUnmount()

    for (const c of this.subComponents) {
      c.removeSelf()
    }
    this.subComponents.length = 0
    this.removed = true
  }
}
