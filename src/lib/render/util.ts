import {Meta} from '../../create-element'

// Assumes keys are the same in both objects
export function equalValues(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean {
  for (const key in a) {
    if (a[key] !== b[key]) return false
  }

  return true
}

function checkChildrenKeys(children: Meta[]) {
  let numKeys = 0
  const set = new Set<string>()

  for (const child of children) {
    if (child !== null && typeof child !== 'string') {
      if (typeof child.props?.key === 'string') {
        numKeys++
        set.add(child.props.key)
      }
    }
  }

  if (numKeys !== set.size) {
    console.error(`Subtrees contain duplicate keys: `, children)
  }
}
