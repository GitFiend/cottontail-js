import {DomComponent} from '../components/dom-component'
import {AnyComponent} from '../components/types'
import {Custom} from '../components/custom-component'
import {TextComponent, TextComponentPool} from '../components/text-component'
import {Order} from './order'
import {DomMetaPool} from '../create-element'

export class Remove {
  static component(component: AnyComponent) {
    switch (component.kind) {
      case 'text':
        return Remove.textComponent(component)
      case 'dom':
        return Remove.domComponent(component)
      case 'custom':
        return Remove.customComponent(component)
    }
  }

  private static textComponent(component: TextComponent) {
    Order.remove(component.domParent, component)

    TextComponentPool.add(component)
  }

  private static domComponent(component: DomComponent) {
    Order.remove(component.domParent, component)

    // TODO: Do custom component subcomponents still react to observables?

    for (const c of component.subComponents.values()) {
      Remove.component(c)
    }

    component.subComponents.clear()

    if (component.inserted.length > 0) {
      component.inserted.length = 0
    }

    // DomMetaPool.add(component.meta)
    // TODO
  }

  private static customComponent(component: Custom) {
    // if (__DEV__ && component.removed) {
    //   console.error('already removed')
    // }

    component.__removed = true
    component.componentWillUnmount()

    if (component.subComponent !== null) {
      Remove.component(component.subComponent)
      component.subComponent = null
    }
  }
}
