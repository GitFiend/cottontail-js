import {CustomMeta, DomMeta, Meta, MetaKind} from '../../create-element'
import {ElementNamespace, updateAttributes} from './set-attributes'
import {RootComponent} from '../components/root-component'
import {DomComponent} from '../components/dom-component'
import {Component, ParentComponent} from '../components/types'
import {TextComponent} from '../components/text-component'
import {Remove} from './remove'

export class Render {
  static component(
    meta: Meta,
    prev: Component | null,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    if (typeof meta === 'string') {
      Render.text(meta, prev, parent, domParent, index)
    } else if (meta.kind === MetaKind.dom) {
      Render.dom(meta, prev, parent, domParent, index)
    } else {
      Render.custom(meta, prev, parent, domParent, index)
    }
  }

  static dom(
    tree: DomMeta,
    prev: Component | null,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    if (!prev) {
      return new DomComponent(tree, parent, domParent, index)
    }

    if (tree.kind === prev.kind && tree.name === prev.meta.name) {
      updateAttributes(
        prev.element,
        ElementNamespace.html,
        tree.props ?? {},
        prev.meta.props,
      )

      prev.meta = tree
      Render.subComponents(prev, prev, tree.children, prev.subComponents)

      return prev
    }

    Remove.component(prev)
    // prev.removeSelf()

    return new DomComponent(tree, parent, domParent, index)
  }

  static text(
    text: string,
    prev: Component | null,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    if (!prev) {
      return new TextComponent(text, parent, domParent, index)
    }

    if (prev?.kind === MetaKind.text) {
      prev.meta = text
      prev.element.textContent = text

      return prev
    }

    Remove.component(prev)

    return new TextComponent(text, parent, domParent, index)
  }

  static custom(
    tree: CustomMeta,
    prev: Component | null,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
    index: number,
  ) {
    //
  }

  static subComponents(
    domParent: DomComponent | RootComponent,
    parent: ParentComponent,
    children: Meta[],
    prevComponents: Map<string, Component>,
  ) {
    const newComponents: Component[] = []

    for (let i = -1; i < children.length; i++) {
      const child = children[i]

      // TODO
    }
  }
}
