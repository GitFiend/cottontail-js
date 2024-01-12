import {DomMeta} from '../create-element'
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
import {MapPool} from '../render/map-pool'

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

export const subComponentMapPool = new MapPool<string, AnyComponent>()

export function makeDomComponent(
  meta: DomMeta,
  directParent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) {
  const {name, props} = meta

  const c: DomComponent = {
    kind: 'dom',
    name,
    props,
    element: document.createElement(name),
    order: Order.key(directParent.order, index),
    key: props?.key ?? directParent.key + index,
    inserted: [],
    subComponents: subComponentMapPool.newMap(),
    siblings: new WeakMap(),
    directParent,
    domParent,
    index,
  }

  setAttributesFromProps(c.element, ElementNamespace.html, props)
  c.subComponents = Render.subComponents(c, c, props.children, c.subComponents)
  Order.insert(domParent, c)

  return c
}
