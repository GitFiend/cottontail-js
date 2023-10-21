import {CustomMeta, DomMeta, Meta, MetaKind} from '../create-element'
import {ElementNamespace, setAttributesFromProps} from './set-attributes'

interface BaseProps {
  key?: string
}

export interface Props extends BaseProps, Object {}

export type Component = DomComponent | CustomComponent<any, any>
export type ParentComponent = RootComponent | DomComponent | CustomComponent<any, any>

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

export abstract class CustomComponent<
  S extends CustomComponent<any, any>,
  P extends Props,
> {
  subComponents: Component[] = []
  kind = MetaKind.custom as const
  removed = false

  // Required to for jsx types.
  // Can we override react class component somehow?
  context: unknown
  setState: any
  forceUpdate: any
  refs: any
  state: ReturnType<S['selectState']>

  constructor(
    public props: P, // public meta: CustomMeta,
    // public parent: ParentComponent,
  ) // public domParent: DomComponent | RootComponent,
  {
    this.state = this.selectState()
  }

  // Can't pass everything in constructor due to how jsx works/react types?
  init(
    meta: CustomMeta,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
  ) {}

  abstract selectState(): ReturnType<S['selectState']>

  abstract render(): Meta | string | null

  update() {
    this.state = this.selectState()
  }

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
