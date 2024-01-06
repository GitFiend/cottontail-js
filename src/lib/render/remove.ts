import {DomComponent} from '../components/dom-component'
import {AnyComponent} from '../components/types'
import {Custom} from '../components/custom-component'
import {TextComponent} from '../components/text-component'
import {Order} from './order'

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

  static textComponent(component: TextComponent) {
    Order.remove(component.domParent, component)
  }

  static domComponent(component: DomComponent) {
    Order.remove(component.domParent, component)

    for (const c of component.subComponents.values()) {
      Remove.component(c)
    }

    component.subComponents.clear()
  }

  static customComponent(component: Custom) {
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
