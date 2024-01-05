import {
  CustomMeta,
  DomMeta,
  FragmentMeta,
  MetaInternal,
} from '../create-element'
import {ElementNamespace, updateAttributes} from './set-attributes'
import {RootComponent} from '../components/root-component'
import {DomComponent} from '../components/dom-component'
import {AnyComponent, ParentComponent} from '../components/types'
import {TextComponent} from '../components/text-component'
import {Remove} from './remove'
import {Order} from './order'
import {Custom, makeCustomComponent} from '../components/custom-component'
import {Fragment} from '../components/fragment'

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
      return new Fragment(meta, meta.children, directParent, domParent, index)
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
            }
          }
        }
      }

      prev.children = meta.children
      prev.subComponents = Render.subComponents(
        prev,
        domParent,
        meta.children,
        prev.subComponents,
      )

      return prev
    }
    Remove.component(prev)
    return new Fragment(meta, meta.children, directParent, domParent, index)
  }

  static dom(
    meta: DomMeta,
    prev: AnyComponent | null,
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    if (prev === null) {
      return new DomComponent(meta, directParent, domParent, index)
    }

    if (meta.kind === prev.kind && meta.name === prev.meta.name) {
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
        meta.props ?? {},
        prev.meta.props,
      )
      prev.meta = meta
      prev.subComponents = Render.subComponents(
        prev,
        prev,
        meta.children,
        prev.subComponents,
      )
      return prev
    }

    Remove.component(prev)
    return new DomComponent(meta, directParent, domParent, index)
  }

  static text(
    meta: string,
    prev: AnyComponent | null,
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    if (!prev) {
      return new TextComponent(meta, directParent, domParent, index)
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
    return new TextComponent(meta, directParent, domParent, index)
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

    if (prev.kind === 'custom' && prev.meta.name.name === meta.name.name) {
      const prevOrder = prev.order
      const newOrder = Order.key(directParent.order, index)

      if (newOrder !== prevOrder) {
        prev.index = index
        prev.order = newOrder

        const {subComponent} = prev

        if (subComponent !== null) {
          const no = Order.key(prev.order, subComponent.index)

          if (subComponent.order !== no) {
            subComponent.order = no

            switch (subComponent.kind) {
              case 'dom':
              case 'text':
                Order.move(domParent, subComponent)
                break
              case 'custom':
                subComponent.update()
                break
            }
          }
        }
      }

      ;(prev as Custom).updateWithNewProps(meta.props)
      return prev
    }

    return makeCustomComponent(meta, directParent, domParent, index)
  }

  static subComponents(
    directParent: ParentComponent,
    domParent: DomComponent | RootComponent,
    children: MetaInternal[],
    prevComponents: Map<string, AnyComponent>,
  ) {
    // if (__DEV__) {
    //   checkChildrenKeys(children)
    // }

    const newComponents = new Map<string, AnyComponent>()
    const len = children.length - 1

    for (let i = len; i >= 0; i--) {
      const child = children[i]

      if (child !== null && child !== undefined) {
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

    return newComponents
  }

  static subComponent(
    meta: Exclude<MetaInternal, null>,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    prevChildren: Map<string, AnyComponent>,
    newChildren: Map<string, AnyComponent>,
    index: number,
  ) {
    if (typeof meta === 'string') {
      const key = index.toString()

      const s = Render.text(
        meta,
        prevChildren.get(key) ?? null,
        parent,
        domParent,
        index,
      )
      prevChildren.delete(key)
      if (s) {
        newChildren.set(key, s)
      }
      return s
    }

    const key: string = meta.props?.key ?? index.toString()
    const s = Render.component(
      meta,
      prevChildren.get(key) ?? null,
      parent,
      domParent,
      index,
    )
    prevChildren.delete(key)
    if (s) {
      newChildren.set(key, s)
    }
    return s
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
