import {MetaKind} from '../create-element'
import {GlobalStack} from './global-stack'

export type Reaction = AutoRun<any> | Reactor<any>

type ForbidPromise<T> = T extends Promise<any> ? never : T

export function autorun<T>(owner: object, fn: () => ForbidPromise<T>) {
  const autoRun = new AutoRun<T>(fn)

  // We do this so that the autorun isn't garbage collected.
  // @ts-ignore
  owner[Symbol()] = autoRun

  autoRun.run()
}

class AutoRun<T> {
  readonly kind = MetaKind.reaction as const
  readonly __ref = new WeakRef(this)

  constructor(private fn: () => ForbidPromise<T>) {}

  run(): void {
    GlobalStack.push(this.__ref)
    this.fn()
    GlobalStack.pop()
  }
}

export function reaction<T>(
  owner: object,
  calc: () => ForbidPromise<T>,
  result: (value: T) => void,
) {
  const reactor = new Reactor<T>(calc, result)

  // We do this so that the autorun isn't garbage collected.
  // @ts-ignore
  owner[Symbol()] = reactor

  reactor.run()
}

export class Reactor<T> {
  readonly kind = MetaKind.reaction as const

  readonly __ref = new WeakRef(this)

  value: T

  constructor(
    private calc: () => ForbidPromise<T>,
    private result: (value: T) => void,
  ) {
    GlobalStack.push(this.__ref)
    this.value = this.calc()
    GlobalStack.pop()
  }

  run(): void {
    GlobalStack.push(this.__ref)
    const value = this.calc()
    GlobalStack.pop()

    if (this.value !== value) {
      this.value = value
      this.result(value)
    }
  }
}
