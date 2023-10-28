import {RootComponent} from './components/root-component'
import {CustomMeta, Meta} from '../create-element'
import {Render} from './render/render'
import {AnyComponent} from './components/types'

export class Cottontail {
  root: RootComponent

  prev: AnyComponent | null = null

  constructor(element: HTMLElement) {
    this.root = new RootComponent(element)
  }

  render(meta: Exclude<Meta, null>) {
    this.prev = Render.component(meta, this.prev, this.root, this.root, 0)
  }
}

export class Cottontail2 {
  private readonly root: RootComponent
  private prev: AnyComponent | null = null
  private readonly meta: Exclude<Meta, null>
  // private element: HTMLElement

  constructor(meta: Meta, element: HTMLElement | null) {
    if (element === null) {
      throw new Error('Cottontail render: Root element is null')
    }
    if (meta === null) {
      throw new Error('Cottontail render: Meta is null')
    }

    // this.element = element
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

export function renderRoot2(meta: Meta, element: HTMLElement | null) {
  const c = new Cottontail2(meta, element)

  return {
    update: c.next,
  }
}

export function renderRoot(meta: Meta, element: HTMLElement | null) {
  if (element === null) {
    throw new Error('Cottontail render: Root element is null')
  }
  if (meta === null) {
    throw new Error('Cottontail render: Meta is null')
  }

  const req = new Cottontail(element)
  req.render(meta)
}
