import {RefObject} from '../components/ref'
import {MetaKind} from '../create-element'
import {GlobalStack} from './global-stack'

export function $AutoRun() {}

export type Reaction = AutoRun | Reactor

class AutoRun {
  kind = MetaKind.reaction as const

  __ref: RefObject<AutoRun> = {current: this}

  // TODO: Could we use a WeakRef here to hold onto the function instead?
  //  What about anonymous functions?
  constructor(private fn: () => void) {}

  run() {
    GlobalStack.push(this.__ref)

    this.fn()

    GlobalStack.pop()
  }
}

export function autorun(fn: () => void) {
  const autoRun = new AutoRun(fn)

  autoRun.run()
}

class Reactor<T = any> {
  kind = MetaKind.reaction as const

  __ref: RefObject<Reactor> = {current: this}

  constructor(
    private calc: () => T,
    private result: (value: T) => void,
  ) {}

  run() {}
}
