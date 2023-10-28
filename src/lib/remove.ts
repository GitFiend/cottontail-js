import {DomComponent} from './components/dom-component'
import {Component} from './components/types'
import {MetaKind} from '../create-element'
import {CustomComponent} from './components/custom-component'
import {TextComponent} from './components/text-component'
import {Order} from './order'

export function removeComponent(component: Component) {
  switch (component.kind) {
    case MetaKind.text:
      return removeTextComponent(component)
    case MetaKind.dom:
      return removeDomComponent(component)
    case MetaKind.custom:
      return removeCustomComponent(component)
  }
}

function removeDomComponent(component: DomComponent) {
  Order.remove(component.domParent, component)

  for (const c of component.subComponents) {
    removeComponent(c)
  }

  component.subComponents.length = 0
}

function removeCustomComponent(component: CustomComponent) {
  if (__DEV__ && component.removed) {
    console.error('already removed')
  }

  component.componentWillUnmount()

  for (const c of component.subComponents) {
    removeComponent(c)
  }

  component.removed = true
  component.subComponents.length = 0
}

function removeTextComponent(component: TextComponent) {
  Order.remove(component.domParent, component)
}
