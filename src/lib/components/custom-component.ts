import {CustomMeta, Meta, MetaKind} from '../../create-element'
import {RootComponent} from './root-component'
import {DomComponent} from './dom-component'
import {AnyComponent, ParentComponent, Props} from './types'
import {Order} from '../render/order'
import {equalValues} from '../render/util'
import {Render} from '../render/render'
import {RefObject} from './ref'
import {GlobalStack} from '../model/global-stack'
import {charge$Runes} from '../model/model'

export abstract class $Component<P extends Props = {}> {
  kind = MetaKind.custom as const
  subComponents = new Map<string, AnyComponent>()

  order: string = ''
  key: string = ''

  __ref: RefObject<$Component> = {
    current: this,
  }

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
    // Do we check both props and state? 1 component type? Or do we have a pure props type?
    if (!equalValues(this.props as any, props as any)) {
      this.props = props

      this.update()
      this.componentDidUpdate()
    }
  }

  mount() {
    charge$Runes(this)
    this.update()
    this.componentDidMount()
  }

  update() {
    GlobalStack.renderedList.add(this)

    // Get the elements to render. We detect observable calls here?
    // This goes an on a global stack, so we can track it?
    GlobalStack.push(this.__ref)
    const res = this.render()
    GlobalStack.pop()

    this.subComponents = Render.subComponents(
      this.directParent,
      this.domParent,
      [res],
      this.subComponents,
    )
  }

  abstract render(): Meta

  // See remove.ts for clean up code.

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
) => $Component<any>

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
