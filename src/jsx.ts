export class ElementMeta {
  constructor(
    public kind: string | Function,
    public props: object | null,
    public children: ElementMeta | null,
  ) {}
}

// Could we look up the current tree instead of constructing again?
export function createElement(
  kind: string | Function,
  props: object | null,
  children?: ElementMeta,
): ElementMeta {
  return new ElementMeta(kind, props, children ?? null)
}
