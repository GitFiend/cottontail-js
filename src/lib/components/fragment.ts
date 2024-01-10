import {FragmentMeta} from '../create-element'
import {AnyComponent, ParentComponent} from './types'
import {RootComponent} from './root-component'
import {DomComponent} from './dom-component'
import {Order} from '../render/order'
import {Render} from '../render/render'

export class Fragment {
  readonly kind = 'fragment' as const

  order: string
  key: string

  // Might be better for perf to have previous and new and swap them.
  subComponents = new Map<string, AnyComponent>()

  constructor(
    public meta: FragmentMeta,
    public directParent: ParentComponent,
    public domParent: DomComponent | RootComponent,
    public index: number,
  ) {
    this.order = Order.key(directParent.order, index)
    this.key = meta.props?.key ?? directParent.key + index

    this.subComponents = Render.subComponents(
      this,
      domParent,
      meta.props.children,
      this.subComponents,
    )
  }
}
