import {DomMeta} from '../create-element'
import {RootComponent} from './root-component'
import {setAttributesFromProps} from '../render/set-attributes'
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
  element: HTMLElement | SVGElement
  order: string
  key: string
  readonly inserted: ElementComponent[]
  subComponents: Map<string, AnyComponent>
  siblings: WeakMap<Element | Text, Element | Text | null>
  directParent: ParentComponent
  domParent: DomComponent | RootComponent
  index: number
  namespace: 'svg' | 'dom'
}

export const subComponentMapPool = new MapPool<string, AnyComponent>()

function makeDomComponent(
  meta: DomMeta,
  directParent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) {
  const {name, props} = meta

  const namespace = name === 'svg' ? 'svg' : domParent.namespace

  const c: DomComponent = {
    kind: 'dom',
    name,
    props,
    element:
      namespace === 'dom'
        ? document.createElement(name)
        : document.createElementNS('http://www.w3.org/2000/svg', name),
    order: Order.key(directParent.order, index),
    key: props?.key ?? directParent.key + index,
    inserted: [],
    subComponents: subComponentMapPool.newMap(),
    siblings: new WeakMap(),
    directParent,
    domParent,
    index,
    namespace,
  }

  setAttributesFromProps(c.element, c.namespace, props)
  c.subComponents = Render.subComponents(c, c, props.children, c.subComponents)
  Order.insert(domParent, c)

  return c
}

class DomComponentPool {
  pool: DomComponent[] = []

  readonly emptyProps = {}

  returnComponent(c: DomComponent) {
    c.props = this.emptyProps
    if (c.inserted.length > 0) {
      c.inserted.length = 0
    }
    if (c.subComponents.size > 0) {
      c.subComponents = subComponentMapPool.newMap()
    }
    c.siblings = new WeakMap()

    this.pool.push(c)
  }

  newComponent(
    meta: DomMeta,
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    const c = this.pool.pop()

    if (c) {
      const {name, props} = meta

      const namespace = name === 'svg' ? 'svg' : domParent.namespace
      c.name = name
      c.props = props
      c.element =
        namespace === 'dom'
          ? document.createElement(name)
          : document.createElementNS('http://www.w3.org/2000/svg', name)
      c.key = props?.key ?? directParent.key + index
      c.order = Order.key(directParent.order, index)
      c.directParent = directParent
      c.domParent = domParent
      c.index = index
      c.namespace = namespace

      setAttributesFromProps(c.element, c.namespace, props)
      c.subComponents = Render.subComponents(
        c,
        c,
        props.children,
        c.subComponents,
      )
      Order.insert(domParent, c)

      return c
    }

    return makeDomComponent(meta, directParent, domParent, index)
  }
}

export const Dom = new DomComponentPool()
