import {RefObject} from '../components/ref'
import {MetaKind} from '../create-element'

export function $AutoRun() {}

export type Reaction = AutoRun | Reactor

class AutoRun {
  kind = MetaKind.reaction as const

  __ref: RefObject<AutoRun> = {current: this}

  constructor(private fn: () => void) {}

  run() {}
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
