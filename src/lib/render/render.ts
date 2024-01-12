import {CustomMeta, DomMeta, FragmentMeta, Meta} from '../create-element'
import {ElementNamespace, updateAttributes} from './set-attributes'
import {RootComponent} from '../components/root-component'
import {
  DomComponent,
  makeDomComponent,
  newSubMap,
  saveMap,
} from '../components/dom-component'
import {AnyComponent, ParentComponent} from '../components/types'
import {TextComponentPool} from '../components/text-component'
import {Remove} from './remove'
import {Order} from './order'
import {Custom, makeCustomComponent} from '../components/custom-component'
import {Fragment} from '../components/fragment'

export class Render {
  static component(
    meta: Meta,
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
    if (meta.kind === 'fragment') {
      return Render.fragment(meta, prev, parent, domParent, index)
    }
    return Render.custom(meta, prev, parent, domParent, index)
  }

  static fragment(
    meta: FragmentMeta,
    prev: AnyComponent | null,
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ): Fragment {
    if (prev === null) {
      return new Fragment(meta, directParent, domParent, index)
    }

    if (prev.kind === 'fragment') {
      const prevOrder = prev.order
      const newOrder = Order.key(directParent.order, index)

      if (prevOrder !== newOrder) {
        prev.index = index
        prev.order = newOrder

        const {subComponents} = prev

        for (const c of subComponents.values()) {
          const no = Order.key(prev.order, c.index)

          if (c.order !== no) {
            c.order = no

            switch (c.kind) {
              case 'dom':
              case 'text':
                Order.move(domParent, c)
                break
              case 'custom':
                c.update()
                break
              case 'fragment':
                // console.error('Not handled!')
                break
            }
          }
        }
      }

      prev.meta.props.children = meta.props.children

      prev.subComponents = Render.subComponents(
        prev,
        domParent,
        meta.props.children,
        prev.subComponents,
      )

      return prev
    }
    Remove.component(prev)
    return new Fragment(meta, directParent, domParent, index)
  }

  static dom(
    meta: DomMeta,
    prev: AnyComponent | null,
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    if (prev === null) {
      return makeDomComponent(meta, directParent, domParent, index)
    }

    if (meta.kind === prev.kind && meta.name === prev.name) {
      // if (filtered.has(meta.n.toString())) {
      //   console.log('update ', meta)
      // }

      const prevOrder = prev.order
      const newOrder = Order.key(directParent.order, index)

      if (prevOrder !== newOrder) {
        prev.index = index
        prev.order = newOrder
        Order.move(domParent, prev)
      }

      updateAttributes(
        prev.element,
        ElementNamespace.html,
        meta.props,
        prev.props,
      )
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
    return makeDomComponent(meta, directParent, domParent, index)
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
      // return new TextComponent(meta, directParent, domParent, index)
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

    if (prev.kind === 'custom' && prev.meta.name === meta.name) {
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
              case 'fragment':
                throw new Error('Forgot to implement')
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
    children: Meta[] | undefined,
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

    const newComponents = newSubMap()

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

    saveMap(prevComponents)

    return newComponents
  }

  private static subComponent(
    meta: Exclude<Meta, null>,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    index: number,
  ) {
    const key =
      typeof meta === 'string' || typeof meta === 'number'
        ? index.toString()
        : meta.props?.key ?? index.toString()

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

// TODO
// function checkChildrenKeys(children: Meta[]): void {
//   let numKeys = 0
//   const set = new Set<string>()
//
//   for (const child of children) {
//     if (typeof child !== 'string' && child?.props) {
//       if (typeof child.props.key === 'string') {
//         numKeys++
//         set.add(child.props.key)
//       }
//     }
//   }
//
//   if (numKeys !== set.size) {
//     console.error(`Subtrees contain duplicate keys: `, children)
//   }
// }
