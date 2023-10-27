import {CustomMeta, Meta, MetaKind} from '../../create-element'
import {RootComponent} from './root-component'
import {DomComponent} from './dom-component'

export interface Props extends Object {
  key?: string
}

export type Component = DomComponent | CustomComponent<any, any>
export type ParentComponent = RootComponent | DomComponent | CustomComponent<any, any>

export abstract class State {}

interface SelectState<P> {
  state: State
  selectState(props: P): void
}

export abstract class CustomComponent<P extends Props = {}, S extends State = State>
  implements SelectState<P>
{
  subComponents: Component[] = []
  kind = MetaKind.custom as const
  removed = false

  abstract state: S
  abstract selectState(props: P): void

  // Required to for jsx types.
  // Can we override react class component somehow?
  context: unknown
  setState: any
  forceUpdate: any
  refs: any

  constructor(
    public props: P, // public meta: CustomMeta,
    // public domParent: DomComponent | RootComponent,
  ) // public parent: ParentComponent,
  {
    // this.state = this.selectState()
  }

  // Can't pass everything in constructor due to how jsx works/react types?
  init(
    meta: CustomMeta,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
  ) {}

  abstract render(): Meta | string | null

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
