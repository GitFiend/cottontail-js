import {CustomMeta, DomMeta, Meta, MetaKind} from '../create-element'
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

interface SelectState<T = unknown> {
  selectState(): T
  state: T
}

export abstract class CustomComponent<P extends Props = Props, S = unknown>
  implements SelectState<S>
{
  subComponents: Component[] = []
  kind = MetaKind.custom as const
  removed = false

  // Required to for jsx types.
  // Can we override react class component somehow?
  context: any
  setState: any
  forceUpdate: any
  refs: any
  state: any

  constructor(
    public props: P, // public meta: CustomMeta,
    // public parent: ParentComponent,
  ) // public domParent: DomComponent | RootComponent,
  {}

  // Can't pass everything in constructor due to how jsx works.
  init(
    meta: CustomMeta,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
  ) {}

  abstract selectState(): S

  // TODO: Cache selected state?
  // get state(): S {
  //   return this.selectState()
  // }

  abstract render(): Meta | string | null

  update() {
    // this.state = this.selectState()
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
