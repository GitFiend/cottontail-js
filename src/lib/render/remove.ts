import {DomComponent} from '../components/dom-component'
import {Component} from '../components/types'
import {MetaKind} from '../../create-element'
import {CustomComponent} from '../components/custom-component'
import {TextComponent} from '../components/text-component'
import {Order} from './order'

export class Remove {
  static component(component: Component) {
    switch (component.kind) {
      case MetaKind.text:
        return Remove.textComponent(component)
      case MetaKind.dom:
        return Remove.domComponent(component)
      case MetaKind.custom:
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

  static customComponent(component: CustomComponent) {
    if (__DEV__ && component.removed) {
      console.error('already removed')
    }

    component.componentWillUnmount()

    for (const c of component.subComponents.values()) {
      Remove.component(c)
    }

    component.removed = true
    component.subComponents.clear()
  }
}