import {RootComponent} from './root-component'
import {DomComponent} from './dom-component'
import {AnyComponent, ParentComponent, Props} from './types'
import {Order} from '../render/order'
import {equalValues} from '../render/util'
import {Render} from '../render/render'
import {GlobalStack} from '../model/global-stack'
import {init$} from '../model/runes'
import {CustomMeta, MetaInternal} from '../create-element'

export abstract class Custom<P extends Props = {}> {
  readonly kind = 'custom' as const

  subComponent: AnyComponent | null = null

  order: string
  key: string

  readonly __ref = new WeakRef(this)

  constructor(
    public props: P,
    public meta: CustomMeta,
    public directParent: ParentComponent,
    public domParent: DomComponent | RootComponent,
    public index: number,
  ) {
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
    init$(this)
    this.update()
    this.componentDidMount()
  }

  update() {
    // TODO: Should this be after the render call?
    GlobalStack.renderedList.add(this)

    // Get the elements to render. We detect observable calls here?
    // This goes an on a global stack, so we can track it?
    GlobalStack.push(this.__ref)
    const newMeta = this.render()
    GlobalStack.pop()

    // TODO: How to handle null?
    if (newMeta !== null) {
      this.subComponent = Render.component(
        newMeta,
        this.subComponent,
        this.directParent,
        this.domParent,
        this.index,
      )
    }
  }

  forceUpdate() {
    GlobalStack.markDirty(this.__ref)
  }

  abstract render(): MetaInternal

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
) => Custom<any>

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
