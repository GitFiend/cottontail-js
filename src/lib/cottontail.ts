import {RootComponent} from './components/root-component'
import {Meta, MetaInternal} from './create-element'
import {Render} from './render/render'
import {AnyComponent} from './components/types'

// TODO: Support more than one instance at a time.
class Cottontail {
  private readonly root: RootComponent
  private prev: AnyComponent | null = null
  private readonly meta: Exclude<MetaInternal, null>

  constructor(meta: Meta, element: HTMLElement | null) {
    if (element === null) {
      throw new Error('Cottontail render: Root element is null')
    }
    if (meta == null) {
      throw new Error('Cottontail render: Meta is null')
    }
    if (typeof meta === 'boolean' || typeof meta === 'number') {
      meta = meta.toString()
    }

    this.meta = meta
    this.root = new RootComponent(element)

    this.render()
  }

  private render = () => {
    this.prev = Render.component(this.meta, this.prev, this.root, this.root, 0)
  }
}

export function renderRoot(meta: Meta, element: HTMLElement | null) {
  new Cottontail(meta, element)
}
