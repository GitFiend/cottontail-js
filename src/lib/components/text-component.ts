import {DomComponent} from './dom-component'
import {ParentComponent} from './types'
import {RootComponent} from './root-component'
import {MetaKind} from '../../create-element'

export class TextComponent {
  kind = MetaKind.text as const
  element: Text

  constructor(
    public meta: string,
    parent: ParentComponent,
    public domParent: DomComponent | RootComponent,
  ) {
    this.element = document.createTextNode(meta)

    domParent.element.append(this.element)
  }

  removeSelf() {
    // TODO
  }
}
