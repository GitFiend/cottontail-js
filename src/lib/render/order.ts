import {RootComponent} from '../components/root-component'
import {DomComponent} from '../components/dom-component'
import {ElementComponent} from '../components/types'

function applyInserts(parent: RootComponent | DomComponent): void {
  const {inserted, siblings, element: parentElement} = parent

  const len = inserted.length

  let next: ElementComponent | null = null

  for (let i = len - 1; i >= 0; i--) {
    const current = inserted[i]

    if (next === null) {
      if (!siblings.has(current.element)) {
        parentElement.insertBefore(current.element, null)
        siblings.set(current.element, null)
      }
    } else if (siblings.has(next.element)) {
      const prevElement = siblings.get(next.element)

      if (prevElement !== current.element) {
        parentElement.insertBefore(current.element, next.element)
        siblings.set(next.element, current.element)
        if (!siblings.has(current.element)) siblings.set(current.element, null)
      }
    }

    next = current
  }
}

export class Order {
  static key(parentOrder: string, index: number): string {
    return parentOrder + String.fromCharCode(index + 48)
  }

  static insert(
    parent: RootComponent | DomComponent,
    child: ElementComponent,
  ): void {
    const {inserted} = parent
    const {order, key} = child

    const len = inserted.length

    for (let i = len - 1; i >= 0; i--) {
      const current = inserted[i]
      const next: ElementComponent | undefined = inserted[i + 1]

      /*
      If order is the same we expect the keys to be different. This
      is expected for a virtual list.
       */
      if (order >= current.order) {
        if (key !== current.key) {
          if (next != null) {
            inserted.splice(i + 1, 0, child)

            applyInserts(parent)
          } else {
            inserted.push(child)
            applyInserts(parent)
          }
        }

        return
      }
    }

    inserted.unshift(child)
    applyInserts(parent)
  }

  static move(parent: RootComponent | DomComponent, child: ElementComponent) {
    const {inserted} = parent
    const {key} = child

    const i = inserted.findIndex(ins => ins.key === key)

    if (i >= 0) {
      inserted.splice(i, 1)
    }

    this.insert(parent, child)
  }

  static remove(
    parent: RootComponent | DomComponent,
    child: ElementComponent,
  ): void {
    const {inserted, siblings} = parent
    const {key} = child

    const i = inserted.findIndex(i => i.key === key)

    if (i >= 0) {
      const [child] = inserted.splice(i, 1)

      siblings.delete(child.element)

      child.element.remove()
    }
  }
}

// export function checkOrder(inserted: ElementComponent[]) {
//   if (!__DEV__) return
//
//   let prev: ElementComponent | null = null
//
//   for (const c of inserted) {
//     console.log(c.key, prev?.key)
//     if (prev !== null) {
//       if (prev.element !== c.element.previousElementSibling) {
//         console.log('elements out of order')
//         // debugger
//       }
//       if (prev.order > c.order) {
//         console.log('keys out of order')
//       }
//     }
//     prev = c
//   }
// }