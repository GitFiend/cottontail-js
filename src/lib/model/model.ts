export function makeObservable(object: Object) {
  for (const key in object) {
    if (key.startsWith('$')) {
      const value: unknown = object[key as keyof object]

      if (!(value instanceof Function)) {
        const valueName = `__${key}`

        Object.defineProperties(object, {
          [valueName]: {
            value,
          },
          [key]: {
            get() {
              // get a ref to the calling component/reaction
              return this[valueName]
            },
            set(value) {
              // Mark the used components/reactions as dirty
              this[valueName].set(value)
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
    makeObservable(this)
  }
}
