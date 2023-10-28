import {RootComponent} from './components/root-component'
import {CustomMeta, Meta} from '../create-element'
import {Render} from './render/render'

export class Cottontail {
  root: RootComponent

  constructor(element: HTMLElement) {
    this.root = new RootComponent(element)
  }

  render(tree: Exclude<Meta, null>) {
    // store result ?
    Render.component(tree, null, this.root, this.root, 0)
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
