import {CustomMeta, Meta, MetaKind} from '../../create-element'
import {RootComponent} from './root-component'
import {DomComponent} from './dom-component'
import {Component, ParentComponent, Props} from './types'
import {Order} from '../render/order'

export abstract class State {}

interface SelectState<P> {
  state: State
  selectState(props: P): void
}

export abstract class CustomComponent<P extends Props = {}, S extends State = State>
  implements SelectState<P>
{
  subComponents = new Map<string, Component>()
  kind = MetaKind.custom as const
  removed = false

  order: string = ''
  key: string = ''
  index = 0

  abstract state: S
  abstract selectState(props: P): void

  // Required to for jsx types.
  // Pull in React type defs and modify them?
  context: unknown
  setState: any
  forceUpdate: any
  refs: any

  constructor(
    public props: P, // public meta: CustomMeta,
    // public parent: ParentComponent,
  ) // public domParent: DomComponent | RootComponent,
  {
    // this.state = this.selectState()
  }

  // Can't pass everything in constructor due to how jsx works/react types?
  init(
    meta: CustomMeta,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    this.index = index
    this.order = Order.key(parent.order, index)
    this.key = this.props.key ?? parent.key + index
  }

  abstract render(): Meta | string | null

  componentDidMount(): void {}

  componentDidUpdate(): void {}

  componentWillUnmount(): void {}

  // removeSelf() {
  //   if (__DEV__ && this.removed) {
  //     console.error('already removed')
  //   }
  //   this.componentWillUnmount()
  //
  //   // Should we detach elements now?
  //
  //   for (const c of this.subComponents) {
  //     c.removeSelf()
  //   }
  //   this.subComponents.length = 0
  //   this.removed = true
  // }
}
