import {MetaKind} from '../create-element'
import {GlobalStack} from './global-stack'

export type Reaction = AutoRun<unknown> | Reactor

type ForbidPromise<T> = T extends Promise<any> ? never : T

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

export function autorun<T>(owner: object, fn: () => ForbidPromise<T>) {
  const autoRun = new AutoRun<T>(fn)

  // We do this so that the autorun isn't garbage collected.
  // @ts-ignore
  owner[Symbol()] = autoRun

  autoRun.run()
}

export class Reactor<T = any> {
  readonly kind = MetaKind.reaction as const

  readonly __ref = new WeakRef(this)

  constructor(
    private calc: () => T,
    private result: (value: T) => void,
  ) {}

  run() {}
}
