import {CustomComponent, Props} from './lib/component'

export type Meta = DomMeta | CustomMeta

export enum MetaKind {
  dom,
  custom,
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
    public props: Props | null,
    public children: Meta[],
  ) {}
}

// Could we look up the current tree instead of constructing again?
export function createElement(
  name: string | Function,
  props: Props | null,
  ...children: Meta[]
): Meta {
  if (typeof name === 'string') {
    return new DomMeta(name, props, children ?? null)
  } else {
    return new CustomMeta(name, props, children ?? null)
  }
}

export class Fragment extends CustomComponent<{}> {
  state = {}

  selectState(): {} {
    return {}
  }

  render() {
    return null
  }
}
