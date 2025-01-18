import {PropsInternal} from './components/types'
import {Fragment} from './components/fragment'
import {CSSProperties} from '../jsx-types'

// Fragment gets converted into DomMeta in the createElement function.
export type Meta = DomMeta | CustomMeta | number | string | Fragment | null
export type MetaInternal = DomMeta | CustomMeta | number | string | null

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

// export interface FragmentMeta {
//   readonly kind: 'fragment'
//   readonly name: Function
//   readonly props: PropsInternal
// }
const fragmentStyle: CSSProperties = {display: 'contents'}

// Could we look up the current tree instead of constructing again?
export function createElement(
  name: string | Function,
  props: ({key?: string} & Record<string, unknown>) | null,
  ...children: unknown[]
): DomMeta | CustomMeta
export function createElement(
  name: string | Function,
  props: ({key?: string} & Record<string, unknown>) | null,
): DomMeta | CustomMeta {
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
  }
  if (name === Fragment) {
    propsInternal.style = fragmentStyle
    return {kind: 'dom', name: 'div', props: propsInternal}
  }
  // if (name === Fragment) {
  //   return {
  //     kind: 'fragment',
  //     name,
  //     props: propsInternal,
  //   }
  // }
  return {
    kind: 'custom',
    name,
    props: propsInternal,
  }
}
