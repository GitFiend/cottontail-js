import {PropsInternal} from './components/types'

export type Meta = DomMeta | CustomMeta | FragmentMeta | number | string | null

export interface DomMeta {
  readonly kind: 'dom'
  readonly name: string
  readonly props: PropsInternal
}

export interface CustomMeta {
  readonly kind: 'custom'
  readonly name: Function
  readonly props: PropsInternal
}

export interface FragmentMeta {
  readonly kind: 'fragment'
  readonly name: Function
  readonly props: PropsInternal
}

// Could we look up the current tree instead of constructing again?
export function createElement(
  name: string | Function,
  props: ({key?: string} & Record<string, unknown>) | null,
  ...children: unknown[]
): DomMeta | CustomMeta | FragmentMeta
export function createElement(
  name: string | Function,
  props: ({key?: string} & Record<string, unknown>) | null,
): DomMeta | CustomMeta | FragmentMeta {
  const propsInternal: PropsInternal = props ?? {children: undefined}

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
    return {kind: 'dom', name, props: propsInternal}
  } else if (name.name === 'Fragment') {
    return {
      kind: 'fragment',
      name,
      props: propsInternal,
    }
  } else {
    return {
      kind: 'custom',
      name,
      props: propsInternal,
    }
  }
}
