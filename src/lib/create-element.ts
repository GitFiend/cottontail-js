import {Props} from './components/types'

export type Meta = DomMeta | CustomMeta | FragmentMeta | string | null

export enum MetaKind {
  text,
  dom,
  custom,
  fragment,
  reaction,
}

export interface DomMeta {
  readonly kind: MetaKind.dom
  readonly name: string
  readonly props: Props | null
  readonly children: Meta[]
}
export function makeDomMeta(
  name: string,
  props: Props | null,
  children: Meta[],
): DomMeta {
  return {kind: MetaKind.dom, name, props, children}
}

export interface CustomMeta {
  readonly kind: MetaKind.custom
  readonly name: Function
  readonly props: Props
  readonly children: Meta[]
}
function makeCustomMeta(name: Function, props: Props, children: Meta[]): CustomMeta {
  return {
    kind: MetaKind.custom,
    name,
    props,
    children,
  }
}

export interface FragmentMeta {
  readonly kind: MetaKind.fragment
  readonly name: Function
  readonly props: Props
  readonly children: Meta[]
}
function makeFragmentMeta(name: Function, props: Props, children: Meta[]): FragmentMeta {
  return {
    kind: MetaKind.fragment,
    name,
    props,
    children,
  }
}

type ElementChildren = (Meta | number | (Meta | number)[])[]

// Could we look up the current tree instead of constructing again?
export function createElement(
  name: string | Function,
  props: Props | null,
  ...children: ElementChildren
): Meta {
  const sanitisedChildren = sanitiseChildren(children)

  if (typeof name === 'string') {
    return makeDomMeta(name, props, sanitisedChildren)
  } else if (name.name === 'Fragment') {
    return makeFragmentMeta(name, props ?? {}, sanitisedChildren)
  } else {
    return makeCustomMeta(name, props ?? {}, sanitisedChildren)
  }
}

function sanitiseChildren(children: ElementChildren): Meta[] {
  const result: Meta[] = []

  for (const child of children) {
    if (Array.isArray(child)) {
      for (const c of child) {
        if (typeof c === 'number') {
          result.push(c.toString())
        } else {
          result.push(c)
        }
      }
    } else if (typeof child === 'number') {
      result.push(child.toString())
    } else {
      result.push(child)
    }
  }

  return result
}
