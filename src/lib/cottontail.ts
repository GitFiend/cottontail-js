import {RootComponent} from './components/root-component'
import {Meta} from '../create-element'
import {Render} from './render'

export class Cottontail {
  root: RootComponent

  constructor(element: HTMLElement) {
    this.root = new RootComponent(element)
  }

  render(tree: Meta) {
    // store result ?
    Render.component(tree, null, this.root, this.root, 0)
  }
}

export function renderRoot(tree: Meta, element: HTMLElement | null) {
  if (!element) {
    throw new Error('Cottontail render: Root element is null')
  }

  const req = new Cottontail(element)
  req.render(tree)
}
