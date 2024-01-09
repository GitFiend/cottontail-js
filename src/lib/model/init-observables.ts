import {GlobalStack} from './global-stack'
import {Custom} from '../components/custom-component'
import {Reaction} from './reactions'

// const debug = true
const debug = false

export function init$(object: Object) {
  for (const key in object) {
    if (key.startsWith('$')) {
      const value: unknown = object[key as keyof object]

      if (!(value instanceof Function)) {
        const valueName = `__${key}`

        // TODO: Investigate whether to make a Rune a class, or just use closed over state here.
        const componentRefs = new Set<WeakRef<Custom | Reaction>>()

        Object.defineProperties(object, {
          [valueName]: {
            value,
            writable: true,
          },
          [key]: {
            get() {
              const currentComponent = GlobalStack.getCurrent()

              if (currentComponent) {
                componentRefs.add(currentComponent)
              }

              return this[valueName]
            },
            set(value) {
              if (this[valueName] === value) return

              if (debug) {
                console.log(`${valueName} <-`, value)
              }

              this[valueName] = value

              const current = GlobalStack.getCurrent()

              if (current) {
                // Don't allow both setting and getting of an observable inside a reaction.
                // This prevents cycles.
                componentRefs.delete(current)
              }

              for (const componentRef of componentRefs.values()) {
                const component = componentRef.deref()
                if (!component) {
                  componentRefs.delete(componentRef)
                } else {
                  GlobalStack.markDirty(componentRef)
                }
              }
              componentRefs.clear()
            },
          },
        })
      }
    }
  }
}
