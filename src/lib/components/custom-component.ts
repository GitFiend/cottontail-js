import {RootComponent} from './root-component'
import {DomComponent} from './dom-component'
import {AnyComponent, ParentComponent, Props} from './types'
import {Order} from '../render/order'
import {equalProps, time, timeEnd} from '../render/util'
import {Render} from '../render/render'
import {GlobalStack} from '../model/global-stack'
import {init$} from '../model/init-observables'
import {CustomMeta, FunctionMeta, Meta} from '../create-element'
import {Remove} from '../render/remove'

export abstract class Custom<P extends Props = {}> {
  readonly kind = 'custom' as const

  subComponent: AnyComponent | null = null

  order: string
  key: string

  readonly __ref = new WeakRef(this)

  // Since renders can be queued, we need to be sure we don't render after we've been removed.
  __removed = false

  constructor(
    public props: P,
    public directParent: ParentComponent,
    public domParent: DomComponent | RootComponent,
    public index: number,
  ) {
    this.order = Order.key(directParent.order, index)
    this.key = this.props?.key ?? directParent.key + index
  }

  updateWithNewProps(props: P): void {
    if (!equalProps(this.props as any, props as any)) {
      this.props = props

      this.update()
    }
  }

  mount() {
    init$(this)
    this.runRender()
    GlobalStack.didMountStack.add(this.__ref)
  }

  private runRender() {
    if (this.__removed) return

    if (__DEV__) {
      time(this.constructor.name)
    }

    // TODO: Should this be after the render call?
    GlobalStack.renderedList.add(this)

    // Get the elements to render. We detect observable calls here?
    // This goes an on a global stack, so we can track it?
    GlobalStack.push(this.__ref)
    const newMeta = this.render()
    GlobalStack.pop()

    if (newMeta !== null) {
      this.subComponent = Render.component(
        newMeta,
        this.subComponent,
        this,
        this.domParent,
        0, // Don't currently support an array render result.
      )
    } else if (this.subComponent !== null) {
      Remove.component(this.subComponent)
      this.subComponent = null
    }
    // TODO: Other cases? 0 and false?

    if (__DEV__) {
      timeEnd(this.constructor.name)
    }
  }

  update() {
    this.runRender()

    GlobalStack.didUpdateStack.add(this.__ref)
  }

  forceUpdate() {
    GlobalStack.markDirty(this.__ref)
  }

  abstract render(): Meta

  // See remove.ts for clean up code.

  // TODO: Is it worth making these nullable instead of having an empty
  //  implementation that needs to always be put in the queue?
  componentDidMount(): void {
    // console.log(`mount ${this.constructor.name}`)
  }

  componentDidUpdate(): void {
    // console.log(`update ${this.constructor.name}`)
  }

  componentWillUnmount(): void {
    // console.log(`will unmount ${this.constructor.name}`)
  }
}

type CustomComponentConstructor = new (
  props: any,
  directParent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) => Custom<any>

export function makeCustomComponent(
  meta: CustomMeta | FunctionMeta,
  directParent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) {
  if (meta.kind === 'custom') {
    const {name: Cons, props} = meta

    const c = new (Cons as CustomComponentConstructor)(
      props,
      directParent,
      domParent,
      index,
    )
    c.mount()
    return c
  }

  const {name, props} = meta

  const Cons = class extends Custom {
    render(): Meta {
      return name(this.props)
    }
  }

  const c = new (Cons as CustomComponentConstructor)(
    props,
    directParent,
    domParent,
    index,
  )
  c.mount()
  return c
}
