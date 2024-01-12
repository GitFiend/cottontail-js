import {PropsInternal} from './components/types'

export type Meta = DomMeta | CustomMeta | FragmentMeta | number | string | null

export interface DomMeta {
  readonly kind: 'dom'
  name: string
  props: PropsInternal
  // n: number
}

let n = 0
let uses: Record<number, number> = {}
export let filtered = new Map<string, number>()

export function logUses() {
  // console.log(uses)

  filtered = new Map(
    Array.from(Object.entries(uses)).filter(([, value]) => value > 1),
  )

  // console.log(filtered)
}

export class DomMetaPool {
  private static objects: DomMeta[] = []
  private static nextObjects: DomMeta[] = []

  private static readonly emptyProps = Object.freeze({})

  static make(name: string, props: PropsInternal): DomMeta {
    const o = this.objects.pop()

    if (o) {
      o.name = name
      o.props = props
      // console.log(o)

      // uses[o.n] ??= 0
      // uses[o.n]++

      return o
    }

    n++
    return {kind: 'dom', name, props}
  }

  static add(o: DomMeta) {
    return

    // if (filtered.has(o.n.toString())) {
    //   console.log('remove ', o)
    // }
    o.props = this.emptyProps
    this.nextObjects.push(o)
  }

  // We move in the objects at the end of the frame?
  // when we are confident they are still being used (e.g. inside children props)
  // TODO: Shouldn't need this.
  static finishFrame() {
    let o = this.nextObjects.pop()

    while (o) {
      this.objects.push(o)
      o = this.nextObjects.pop()
    }
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
    return DomMetaPool.make(name, propsInternal)
    // return {kind: 'dom', name, props: propsInternal}
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
