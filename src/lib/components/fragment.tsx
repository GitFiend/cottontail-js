export class Fragment {}
//
// export class Fragment2 {
//   readonly kind = 'fragment' as const
//
//   order: string
//   key: string
//
//   // Might be better for perf to have previous and new and swap them.
//   subComponents = subComponentMapPool.newMap()
//
//   constructor(
//     public meta: FragmentMeta,
//     public directParent: ParentComponent,
//     public domParent: DomComponent | RootComponent,
//     public index: number,
//   ) {
//     this.order = Order.key(directParent.order, index)
//     this.key = meta.props?.key ?? directParent.key + index
//
//     this.subComponents = Render.subComponents(
//       this,
//       domParent,
//       meta.props.children,
//       this.subComponents,
//     )
//   }
// }
