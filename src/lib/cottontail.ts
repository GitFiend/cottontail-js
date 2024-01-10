import {RootComponent} from './components/root-component'
import {Meta} from './create-element'
import {Render} from './render/render'
import {AnyComponent} from './components/types'
import {GlobalStack} from './model/global-stack'

// TODO: Support more than one instance at a time.
export class Cottontail {
  readonly root: RootComponent
  private prev: AnyComponent | null = null
  private meta: Meta
  element: HTMLElement

  constructor(meta: Meta, element: HTMLElement | null) {
    if (element === null) {
      throw new Error('Cottontail render: Root element is null')
    }
    if (meta == null) {
      throw new Error('Cottontail render: Meta is null')
    }
    if (typeof meta === 'number') {
      meta = meta.toString()
    }

    this.element = element
    this.meta = meta
    this.root = new RootComponent(element)

    this.render()
  }

  private render = () => {
    this.prev = Render.component(this.meta, this.prev, this.root, this.root, 0)
    GlobalStack.drawFrame()
  }

  rerender(meta: Meta) {
    if (typeof meta === 'number') {
      this.meta = meta.toString()
    } else if (meta === undefined) {
      this.meta = null
    } else {
      this.meta = meta
    }
    this.render()
  }
}

export function renderRoot(meta: Meta, element: HTMLElement | null) {
  new Cottontail(meta, element)
}
