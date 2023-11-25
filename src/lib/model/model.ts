import {RefObject} from '../components/ref'
import {GlobalStack} from './global-stack'
import {CTComponent} from '../components/custom-component'

export function charge$Runes(object: Object) {
  for (const key in object) {
    if (key.startsWith('$')) {
      const value: unknown = object[key as keyof object]

      if (!(value instanceof Function)) {
        // TODO: Investigate whether to make a Rune a class, or just use closed over state here.

        const valueName = `__${key}`
        const componentRefs = new Set<RefObject<CTComponent>>()

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
              for (const componentRef of componentRefs.values()) {
                if (componentRef.current === null) {
                  componentRefs.delete(componentRef)
                } else {
                  GlobalStack.markDirty(componentRef)
                }
              }

              this[valueName] = value
            },
          },
        })
      }
    }
  }
}

class Model {
  $a = 4

  constructor() {
    charge$Runes(this)
  }
}
