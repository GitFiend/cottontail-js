import {PropsInternal} from './components/types'

export type Meta = DomMeta | CustomMeta | FragmentMeta | number | string | null

export interface DomMeta {
  readonly kind: 'dom'
  name: string
  props: PropsInternal
}

export class DomMetaPool {
  private static objects: DomMeta[] = []

  private static readonly emptyProps = Object.freeze({})

  static make(name: string, props: PropsInternal): DomMeta {
    const o = this.objects.pop()

    if (o) {
      o.name = name
      o.props = props
      return o
    }

    return {kind: 'dom', name, props}
  }

  static add(o: DomMeta) {
    o.props = this.emptyProps
    this.objects.push(o)
  }
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
    // return DomMetaPool.make(name, propsInternal)
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
