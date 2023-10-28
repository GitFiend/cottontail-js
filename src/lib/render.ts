import {CustomMeta, DomMeta, Meta, MetaKind} from '../create-element'
import {ElementNamespace, updateAttributes} from './set-attributes'
import {RootComponent} from './components/root-component'
import {DomComponent} from './components/dom-component'
import {Component, ParentComponent} from './components/types'
import {TextComponent} from './components/text-component'
import {removeComponent} from './remove'

export class Cottontail {
  root: RootComponent

  constructor(element: HTMLElement) {
    this.root = new RootComponent(element)
  }

  render(tree: Meta) {
    // store result ?
    renderTree(tree, null, this.root, this.root, 0)
  }
}

export function renderTree(
  tree: Meta,
  prev: Component | null,
  parent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) {
  if (typeof tree === 'string') {
    renderText(tree, prev, parent, domParent, index)
  } else if (tree.kind === MetaKind.dom) {
    renderDom(tree, prev, parent, domParent, index)
  } else {
    renderCustom(tree, prev, parent, domParent, index)
  }
}

export function renderText(
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

  // prev.removeSelf()
  removeComponent(prev)

  return new TextComponent(text, parent, domParent, index)
}

export function renderDom(
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
    renderSubComponents(prev, prev, tree.children, prev.subComponents)

    return prev
  }

  removeComponent(prev)
  // prev.removeSelf()

  return new DomComponent(tree, parent, domParent, index)
}

export function renderSubComponents(
  domParent: DomComponent | RootComponent,
  parent: ParentComponent,
  children: Meta[],
  prevComponents: Component[],
) {
  const newComponents: Component[] = []

  for (let i = -1; i < children.length; i++) {
    const child = children[i]
    const prev = prevComponents[i]

    // TODO
  }
}

export function renderSubComponent() {}

export function renderCustom(
  tree: CustomMeta,
  prev: Component | null,
  parent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) {
  //
}

export function render(tree: Meta, element: HTMLElement | null) {
  if (!element) {
    throw new Error('Cottontail render: Root element is null')
  }

  const req = new Cottontail(element)
  req.render(tree)
}
