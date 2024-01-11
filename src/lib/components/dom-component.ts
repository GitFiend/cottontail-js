import {DomMeta, DomMetaPool} from '../create-element'
import {RootComponent} from './root-component'
import {
  ElementNamespace,
  setAttributesFromProps,
} from '../render/set-attributes'
import {Render} from '../render/render'
import {
  AnyComponent,
  ElementComponent,
  ParentComponent,
  PropsInternal,
} from './types'
import {Order} from '../render/order'

export interface DomComponent {
  readonly kind: 'dom'
  name: string
  props: PropsInternal
  element: HTMLElement
  order: string
  key: string
  readonly inserted: ElementComponent[]
  subComponents: Map<string, AnyComponent>
  readonly siblings: WeakMap<Element | Text, Element | Text | null>
  directParent: ParentComponent
  domParent: DomComponent | RootComponent
  index: number
}

export function makeDomComponent(
  meta: DomMeta,
  directParent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) {
  const {name, props} = meta

  // If this is a child, we can't do this?

  const c: DomComponent = {
    kind: 'dom',
    name,
    props,
    element: document.createElement(name),
    order: Order.key(directParent.order, index),
    key: props?.key ?? directParent.key + index,
    inserted: [],
    subComponents: new Map(),
    siblings: new WeakMap(),
    directParent,
    domParent,
    index,
  }

  setAttributesFromProps(c.element, ElementNamespace.html, props)
  c.subComponents = Render.subComponents(c, c, props.children, c.subComponents)
  Order.insert(domParent, c)
  DomMetaPool.add(meta)

  return c
}

// export class DomComponent {
//   readonly kind = 'dom' as const
//   element: HTMLElement
//   order: string
//   key: string
//
//   inserted: ElementComponent[] = []
//
//   // TODO: Have A and B for switching
//   subComponents = new Map<string, AnyComponent>()
//   // key is an element, value is the previous element
//   siblings = new WeakMap<Element | Text, Element | Text | null>()
//
//   constructor(
//     meta: DomMeta,
//     public directParent: ParentComponent,
//     public domParent: DomComponent | RootComponent,
//     public index: number,
//   ) {
//     if (filtered.has(meta.n.toString())) {
//       console.log('create ', meta)
//     }
//     this.order = Order.key(directParent.order, index)
//     this.key = meta.props?.key ?? directParent.key + index
//     this.element = document.createElement(meta.name)
//
//     if (meta.props) {
//       setAttributesFromProps(this.element, ElementNamespace.html, meta.props)
//     }
//
//     this.subComponents = Render.subComponents(
//       this,
//       this,
//       meta.props.children,
//       this.subComponents,
//     )
//
//     Order.insert(domParent, this)
//   }
// }
