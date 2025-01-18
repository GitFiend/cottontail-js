import {CustomMeta, DomMeta, Meta, MetaInternal} from '../create-element'
import {updateAttributes} from './set-attributes'
import {RootComponent} from '../components/root-component'
import {
  Dom,
  DomComponent,
  subComponentMapPool,
} from '../components/dom-component'
import {AnyComponent, ParentComponent} from '../components/types'
import {TextComponentPool} from '../components/text-component'
import {Remove} from './remove'
import {Order} from './order'
import {Custom, makeCustomComponent} from '../components/custom-component'

export class Render {
  static component(
    meta: MetaInternal,
    prev: AnyComponent | null,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ): AnyComponent | null {
    if (meta === null) {
      if (prev !== null) {
        Remove.component(prev)
      }
      return null
    }
    if (typeof meta === 'number') {
      return Render.text(meta.toString(), prev, parent, domParent, index)
    }
    if (typeof meta === 'string') {
      return Render.text(meta, prev, parent, domParent, index)
    }
    if (meta.kind === 'dom') {
      return Render.dom(meta, prev, parent, domParent, index)
    }
    return Render.custom(meta, prev, parent, domParent, index)
  }

  static dom(
    meta: DomMeta,
    prev: AnyComponent | null,
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    if (prev === null) {
      return Dom.newComponent(meta, directParent, domParent, index)
    }

    if (meta.kind === prev.kind && meta.name === prev.name) {
      const prevOrder = prev.order
      const newOrder = Order.key(directParent.order, index)

      if (prevOrder !== newOrder) {
        prev.index = index
        prev.order = newOrder
        Order.move(domParent, prev)
      }

      updateAttributes(prev.element, prev.namespace, meta.props, prev.props)
      prev.name = meta.name
      prev.props = meta.props

      prev.subComponents = Render.subComponents(
        prev,
        prev,
        meta.props.children,
        prev.subComponents,
      )

      return prev
    }

    Remove.component(prev)
    return Dom.newComponent(meta, directParent, domParent, index)
  }

  static text(
    meta: string,
    prev: AnyComponent | null,
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    if (!prev) {
      return TextComponentPool.makeTextComponent(
        meta,
        directParent,
        domParent,
        index,
      )
    }

    if (prev?.kind === 'text') {
      const prevOrder = prev.order
      const newOrder = Order.key(directParent.order, index)

      if (prevOrder !== newOrder) {
        prev.index = index
        prev.order = newOrder

        Order.move(domParent, prev)
      }

      if (prev.meta === meta) {
        return prev
      }

      prev.element.nodeValue = meta
      prev.meta = meta
      return prev
    }

    Remove.component(prev)
    return TextComponentPool.makeTextComponent(
      meta,
      directParent,
      domParent,
      index,
    )
  }

  static custom(
    meta: CustomMeta,
    prev: AnyComponent | null,
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ): Custom {
    if (!prev) {
      return makeCustomComponent(meta, directParent, domParent, index)
    }

    if (prev.kind === 'custom' && prev.constructor === meta.name) {
      const prevOrder = prev.order
      const newOrder = Order.key(directParent.order, index)

      if (newOrder !== prevOrder) {
        prev.index = index
        prev.order = newOrder

        const {subComponent} = prev

        if (subComponent !== null) {
          const newOrder = Order.key(prev.order, subComponent.index)

          if (subComponent.order !== newOrder) {
            subComponent.order = newOrder

            switch (subComponent.kind) {
              case 'dom':
              case 'text':
                Order.move(domParent, subComponent)
                break
              case 'custom':
                subComponent.update()
                break
              default:
                if (__DEV__) {
                  throw 'Unexpected fallthrough in custom subcomponent types'
                }
                break
            }
          }
        }
      }

      ;(prev as Custom).updateWithNewProps(meta.props)
      return prev
    }

    Remove.component(prev)
    return makeCustomComponent(meta, directParent, domParent, index)
  }

  static subComponents(
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    children: MetaInternal[] | undefined,
    prevComponents: Map<string, AnyComponent>,
  ) {
    // if (__DEV__) {
    //   checkChildrenKeys(children)
    // }
    if (!children) {
      for (const c of prevComponents.values()) {
        Remove.component(c)
      }
      prevComponents.clear()

      return prevComponents
    }

    const newComponents = subComponentMapPool.newMap()

    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i]

      if (child != null) {
        Render.subComponent(
          child,
          directParent,
          domParent,
          prevComponents,
          newComponents,
          i,
        )
      }
    }

    for (const c of prevComponents.values()) {
      Remove.component(c)
    }

    subComponentMapPool.returnMap(prevComponents)

    return newComponents
  }

  private static subComponent(
    meta: Exclude<MetaInternal, null>,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    index: number,
  ) {
    const key =
      typeof meta === 'string' || typeof meta === 'number'
        ? index.toString()
        : (meta.props?.key ?? index.toString())

    const c = Render.component(
      meta,
      prevChildren.get(key) ?? null,
      parent,
      domParent,
      index,
    )
    prevChildren.delete(key)
    if (c) {
      newChildren.set(key, c)
    }
    return c
  }
}
