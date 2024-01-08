import {GlobalStack} from './global-stack'
import {equalValues} from '../render/util'

export type Reaction = AutoRun<any> | ValueReactor<any> | ObjectReactor<any>

type ForbidPromise<T> = T extends Promise<any> ? never : T

export function autorun<T>(fn: () => ForbidPromise<T>, owner: object) {
  const autoRun = new AutoRun<T>(fn)

  // We do this so that the autorun isn't garbage collected.
  // @ts-ignore
  owner[Symbol()] = autoRun

  autoRun.run()
}

class AutoRun<T> {
  readonly kind = 'reaction' as const
  readonly __ref = new WeakRef(this)

  constructor(private fn: () => ForbidPromise<T>) {}

  run(): void {
    GlobalStack.push(this.__ref)
    this.fn()
    GlobalStack.pop()
  }
}

export namespace Reaction {
  export function auto<T>(fn: () => ForbidPromise<T>, owner: object) {
    const autoRun = new AutoRun<T>(fn)

    // We do this so that the autorun isn't garbage collected.
    // @ts-ignore
    owner[Symbol()] = autoRun

    autoRun.run()
  }

  export function value<T>(
    calc: () => ForbidPromise<T>,
    result: (value: T) => void,
    owner: object,
  ) {
    const reactor = new ValueReactor<T>(calc, result)

    // We do this so the reaction isn't garbage collected.
    // @ts-ignore
    owner[Symbol()] = reactor

    reactor.run()
  }

  // TODO: Support null?
  export function object<T extends Record<string, unknown>>(
    calc: () => ForbidPromise<T>,
    result: (value: T) => void,
    owner: object,
  ) {
    const reactor = new ObjectReactor<T>(calc, result)

    // We do this so the reaction isn't garbage collected.
    // @ts-ignore
    owner[Symbol()] = reactor

    reactor.run()
  }
}

export function reaction<T>(
  calc: () => ForbidPromise<T>,
  result: (value: T) => void,
  owner: object,
) {
  const reactor = new ValueReactor<T>(calc, result)

  // We do this so the reaction isn't garbage collected.
  // @ts-ignore
  owner[Symbol()] = reactor

  reactor.run()
}

class ObjectReactor<T extends Record<string, unknown>> {
  readonly kind = 'reaction' as const

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

    if (!equalValues(this.value, value)) {
      this.value = value
      this.result(value)
    }
  }
}

class ValueReactor<T> {
  readonly kind = 'reaction' as const

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
