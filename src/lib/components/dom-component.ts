import {DomMeta, MetaKind} from '../../create-element'
import {RootComponent} from './root-component'
import {ElementNamespace, setAttributesFromProps} from '../render/set-attributes'
import {Render} from '../render/render'
import {AnyComponent, ElementComponent, ParentComponent} from './types'
import {Order} from '../render/order'

export class DomComponent {
  kind = MetaKind.dom as const
  element: HTMLElement
  order: string
  key: string

  inserted: ElementComponent[] = []
  subComponents = new Map<string, AnyComponent>()
  // key is an element, value is the previous element
  siblings = new WeakMap<Element | Text, Element | Text | null>()

  constructor(
    public meta: DomMeta,
    public directParent: ParentComponent,
    public domParent: DomComponent | RootComponent,
    public index: number,
  ) {
    this.order = Order.key(directParent.order, index)
    this.key = meta.props?.key ?? directParent.key + index
    this.element = document.createElement(meta.name)

    if (meta.props) {
      setAttributesFromProps(this.element, ElementNamespace.html, meta.props)
    }

    this.subComponents = Render.subComponents(
      this,
      this,
      meta.children,
      this.subComponents,
    )

    Order.insert(domParent, this)
  }
}
