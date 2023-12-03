import {Props} from './components/types'

export type Meta = DomMeta | CustomMeta | FragmentMeta | string | null

export enum MetaKind {
  text,
  dom,
  custom,
  fragment,
  reaction,
}

export class DomMeta {
  readonly kind = MetaKind.dom as const

  constructor(
    public readonly name: string,
    public readonly props: Props | null,
    public readonly children: Meta[],
  ) {}
}

export class CustomMeta {
  readonly kind = MetaKind.custom as const

  constructor(
    public readonly name: Function,
    public readonly props: Props,
    public readonly children: Meta[],
  ) {}
}

export class FragmentMeta {
  readonly kind = MetaKind.fragment as const

  constructor(
    public readonly name: Function,
    public readonly props: Props,
    public readonly children: Meta[],
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
  } else if (name.name === 'Fragment') {
    return new FragmentMeta(name, props ?? {}, sanitisedChildren)
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
