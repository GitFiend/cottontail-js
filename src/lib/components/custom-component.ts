import {CustomMeta, Meta, MetaKind} from '../../create-element'
import {RootComponent} from './root-component'
import {DomComponent} from './dom-component'
import {AnyComponent, ParentComponent, Props} from './types'
import {Order} from '../render/order'
import {RefObject} from './ref'
import {equalValues} from '../render/util'
import {Render} from '../render/render'

export abstract class State {}

interface SelectState<P> {
  state: State
  selectState(props: P): void
}

export abstract class CustomComponent<P extends Props = {}, S extends State = State>
  implements SelectState<P>
{
  kind = MetaKind.custom as const
  subComponents = new Map<string, AnyComponent>()

  order: string = ''
  key: string = ''

  removed = false

  // TODO
  _ref: RefObject<this> = {
    current: this,
  }

  abstract state: S
  selectState(props: P) {}
  private prevState: S | {} = {}

  constructor(
    public props: P,
    public meta: CustomMeta,
    public directParent: ParentComponent,
    public domParent: DomComponent | RootComponent,
    public index: number,
  ) {
    this.index = index
    this.order = Order.key(directParent.order, index)
    this.key = this.props?.key ?? directParent.key + index
  }

  updateWithNewProps(props: P) {
    this.selectState(props)

    if (
      !equalValues(this.props as any, props as any) ||
      !equalValues(this.state as any, this.prevState as any)
    ) {
      this.props = props
      this.prevState = {...this.state}

      this.update()
      this.componentDidUpdate()
    }
  }

  mount() {
    this.update()
    this.componentDidMount()
  }

  update() {
    const res = this.render()

    this.subComponents = Render.subComponents(
      this.directParent,
      this.domParent,
      [res],
      this.subComponents,
    )
  }

  abstract render(): Meta

  componentDidMount(): void {}

  componentDidUpdate(): void {}

  componentWillUnmount(): void {}
}

type CustomComponentConstructor = new (
  props: any,
  meta: CustomMeta,
  directParent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) => CustomComponent<any, any>

export function makeCustomComponent(
  meta: CustomMeta,
  directParent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) {
  const {name: Cons, props} = meta

  const c = new (Cons as CustomComponentConstructor)(
    props,
    meta,
    directParent,
    domParent,
    index,
  )
  c.mount()
  return c
}
