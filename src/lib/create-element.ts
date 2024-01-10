import {PropsInternal} from './components/types'

export type Meta = DomMeta | CustomMeta | FragmentMeta | number | string | null

export interface DomMeta {
  readonly kind: 'dom'
  readonly name: string
  readonly props: PropsInternal
}
export function makeDomMeta(name: string, props: PropsInternal): DomMeta {
  return {kind: 'dom', name, props}
}

export interface CustomMeta {
  readonly kind: 'custom'
  readonly name: Function
  readonly props: PropsInternal
}
function makeCustomMeta(name: Function, props: PropsInternal): CustomMeta {
  return {
    kind: 'custom',
    name,
    props,
  }
}

export interface FragmentMeta {
  readonly kind: 'fragment'
  readonly name: Function
  readonly props: PropsInternal
}
function makeFragmentMeta(name: Function, props: PropsInternal): FragmentMeta {
  return {
    kind: 'fragment',
    name,
    props,
  }
}

// Could we look up the current tree instead of constructing again?
export function createElement(
  name: string | Function,
  props: ({key?: string} & Record<string, unknown>) | null,
  ...children: unknown[]
): Meta
export function createElement(
  name: string | Function,
  props: ({key?: string} & Record<string, unknown>) | null,
): Meta {
  const propsInternal: PropsInternal = props ?? {}

  if (arguments.length > 2) {
    if (Array.isArray(arguments[2])) {
      propsInternal.children = arguments[2]
    } else {
      const children = []

      for (let i = 2; i < arguments.length; i++) {
        children.push(arguments[i])
      }
      propsInternal.children = children
    }
  }

  if (typeof name === 'string') {
    return makeDomMeta(name, propsInternal)
  } else if (name.name === 'Fragment') {
    return makeFragmentMeta(name, propsInternal)
  } else {
    return makeCustomMeta(name, propsInternal)
  }
}
