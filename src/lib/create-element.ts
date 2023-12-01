import {$Component} from './components/custom-component'
import {Props} from './components/types'

export type Meta = DomMeta | CustomMeta | string | null

export enum MetaKind {
  text,
  dom,
  custom,
  reaction,
}

export class DomMeta {
  kind = MetaKind.dom as const

  constructor(
    public name: string,
    public props: Props | null,
    public children: Meta[],
  ) {}
}

export class CustomMeta {
  kind = MetaKind.custom as const

  constructor(
    public name: Function,
    public props: Props,
    public children: Meta[],
  ) {}
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
    return new DomMeta(name, props, sanitisedChildren)
  } else {
    return new CustomMeta(name, props ?? {}, sanitisedChildren)
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

export class Fragment extends $Component {
  render() {
    throw new Error('TODO Fragments!')
    return null
  }
}
