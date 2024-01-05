import {Props} from './components/types'

export type Meta =
  | DomMeta
  | CustomMeta
  | FragmentMeta
  | boolean
  | number
  | string
  | null
  | undefined

export type MetaInternal = Exclude<Meta, boolean | number | undefined>

export interface DomMeta {
  readonly kind: 'dom'
  readonly name: string
  readonly props: Props | null
  readonly children: MetaInternal[]
}
export function makeDomMeta(
  name: string,
  props: Props | null,
  children: MetaInternal[],
): DomMeta {
  return {kind: 'dom', name, props, children}
}

export interface CustomMeta {
  readonly kind: 'custom'
  readonly name: Function
  readonly props: Props
  readonly children: MetaInternal[]
}
function makeCustomMeta(
  name: Function,
  props: Props,
  children: MetaInternal[],
): CustomMeta {
  return {
    kind: 'custom',
    name,
    props,
    children,
  }
}

export interface FragmentMeta {
  readonly kind: 'fragment'
  readonly name: Function
  readonly props: Props
  readonly children: MetaInternal[]
}
function makeFragmentMeta(
  name: Function,
  props: Props,
  children: MetaInternal[],
): FragmentMeta {
  return {
    kind: 'fragment',
    name,
    props,
    children,
  }
}

type ElementChildren = (Meta | Meta[])[]

// Could we look up the current tree instead of constructing again?
export function createElement(
  name: string | Function,
  props: Props | null,
  ...children: ElementChildren
): Meta {
  const sanitisedChildren = sanitiseChildren(children)
  props ??= {}
  props.children = sanitisedChildren

  if (typeof name === 'string') {
    return makeDomMeta(name, props, sanitisedChildren)
  } else if (name.name === 'Fragment') {
    return makeFragmentMeta(name, props, sanitisedChildren)
  } else {
    return makeCustomMeta(name, props, sanitisedChildren)
  }
}

function sanitiseChildren(children: ElementChildren): MetaInternal[] {
  if (children.length === 0) return children as MetaInternal[]

  const result: MetaInternal[] = []

  for (const child of children) {
    if (Array.isArray(child)) {
      for (const c of child) {
        if (c == null) {
          result.push(null)
        } else if (typeof c !== 'object') {
          result.push(c.toString())
        } else {
          result.push(c)
        }
      }
    } else if (child == null) {
      result.push(null)
    } else if (typeof child !== 'object') {
      result.push(child.toString())
    } else {
      result.push(child)
    }
  }

  return result
}
