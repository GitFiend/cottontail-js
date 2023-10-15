import {CustomMeta, DomMeta, Meta, MetaKind} from '../create-element'
import {Component, DomComponent, ParentComponent, RootComponent} from './component'
import {ElementNamespace, updateAttributes} from './set-attributes'

export class ReqFrame {
  root: RootComponent

  constructor(element: HTMLElement) {
    this.root = new RootComponent(element)
  }

  render(tree: Meta) {
    // store result ?
    this.renderTree(tree, null, this.root, this.root)
  }

  private renderTree(
    tree: Meta,
    prev: Component | null,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
  ) {
    if (tree.kind === MetaKind.dom) {
      this.renderDom(tree, prev, parent, domParent)
    } else {
      this.renderCustom(tree, prev, parent, domParent)
    }
  }

  private renderDom(
    tree: DomMeta,
    prev: Component | null,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
  ) {
    if (!prev) {
      return new DomComponent(tree, parent, domParent)
    }

    if (tree.kind === prev.kind && tree.name === prev.meta.name) {
      updateAttributes(
        prev.element,
        ElementNamespace.html,
        tree.props ?? {},
        prev.meta.props,
      )

      prev.meta = tree
      prev.renderSubComponents()

      return prev
    }

    prev.removeSelf()

    return new DomComponent(tree, parent, domParent)
  }

  private renderSubComponents(
    domParent: DomComponent | RootComponent,
    parent: ParentComponent,
    children: Meta,
    prevComponents: Component[],
  ) {
    const newComponents: Component[] = []

    //
  }

  private renderCustom(
    tree: CustomMeta,
    prev: Component | null,
    parent: ParentComponent,
    domParent: DomComponent | RootComponent,
  ) {
    //
  }
}
