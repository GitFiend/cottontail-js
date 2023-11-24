import {CustomMeta, Meta, MetaKind} from '../../create-element'
import {RootComponent} from './root-component'
import {DomComponent} from './dom-component'
import {AnyComponent, ParentComponent, Props} from './types'
import {Order} from '../render/order'
import {equalValues} from '../render/util'
import {Render} from '../render/render'

export abstract class CTComponent<P extends Props = {}, S extends {} = {}> {
  kind = MetaKind.custom as const
  subComponents = new Map<string, AnyComponent>()

  order: string = ''
  key: string = ''

  removed = false

  abstract state: S

  // Call this 'onRenderCalled'? 'beforeRender'? 'beforeUpdate'?
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

  updateWithNewProps(props: P): void {
    this.selectState(props)

    // Do we check both props and state? 1 component type? Or do we have a pure props type?
    if (
      !equalValues(this.props as any, props as any) ||
      !equalValues(this.state as any, this.prevState as any)
    ) {
      this.props = props
      // TODO: Copy across properties when we compare instead of allocating new object.
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
    // Get the elements to render. We detect observable calls here?
    // This goes an on a global stack, so we can track it?
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
) => CTComponent<any, any>

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
