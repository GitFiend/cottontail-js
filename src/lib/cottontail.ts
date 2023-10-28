import {RootComponent} from './components/root-component'
import {Meta} from '../create-element'
import {Render} from './render/render'
import {AnyComponent} from './components/types'

export class Cottontail {
  private readonly root: RootComponent
  private prev: AnyComponent | null = null
  private readonly meta: Exclude<Meta, null>

  constructor(meta: Meta, element: HTMLElement | null) {
    if (element === null) {
      throw new Error('Cottontail render: Root element is null')
    }
    if (meta === null) {
      throw new Error('Cottontail render: Meta is null')
    }

    this.meta = meta
    this.root = new RootComponent(element)

    this.render()
  }

  private render() {
    this.prev = Render.component(this.meta, this.prev, this.root, this.root, 0)
  }

  next = () => {
    this.render()
  }
}

export function renderRoot(meta: Meta, element: HTMLElement | null) {
  const c = new Cottontail(meta, element)

  return {
    update: c.next,
  }
}
