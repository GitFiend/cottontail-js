import {DomMetaPool, Meta} from '../create-element'

export function reclaimMetaObjects(meta: Meta) {
  if (typeof meta === 'object' && meta?.kind === 'dom') {
    const {children} = meta.props

    if (children) {
      for (const c of children) {
        reclaimMetaObjects(c)
      }
    }

    // Needs to happen last as we wipe the props.
    DomMetaPool.add(meta)
  }
}
