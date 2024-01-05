import {Meta} from '../create-element'
import {Cottontail} from '../cottontail'

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
    if (child != null && typeof child === 'object') {
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

export function c(names: TemplateStringsArray, ...flags: boolean[]): string {
  if (names.length === 1) return names[0]

  let classes = ''
  for (let i = 0; i < names.length; i++) {
    if (flags[i]) classes += names[i]
  }
  return classes.trim()
}

export function mkRoot(meta: Meta) {
  return new Cottontail(meta, document.createElement('div'))
}
