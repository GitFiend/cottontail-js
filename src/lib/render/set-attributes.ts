import {RefObject} from '../components/ref'
import {Props} from '../components/types'
import {setStyles, updateStyles} from './set-styles'

// This should only be called the first time or if previous props were null.
export function setAttributesFromProps(
  element: Element,
  namespace: 'svg' | 'dom',
  props: Props,
): void {
  for (const attr in props) {
    // @ts-ignore
    const value = props[attr]

    if (value !== undefined) {
      // @ts-ignore
      setAttribute(element, namespace, attr, props[attr])
    }
  }
}

export function updateAttributes(
  element: Element,
  namespace: 'svg' | 'dom',
  newProps: object,
  oldProps: object,
): void {
  for (const attr in newProps) {
    // @ts-ignore
    const oldValue = oldProps[attr]
    // @ts-ignore
    const newValue = newProps[attr]

    if (newValue === undefined) {
      deleteAttribute(element, attr, oldValue)
      continue
    }

    if (oldValue === undefined) {
      setAttribute(element, namespace, attr, newValue)
    } else if (oldValue !== newValue) {
      if (attr.startsWith('on')) {
        deleteAttribute(element, attr, oldValue)
        setAttribute(element, namespace, attr, newValue)
      } else if (attr === 'style') {
        updateStyles(element as HTMLElement, oldValue, newValue)
      } else {
        setAttribute(element, namespace, attr, newValue)
      }
    }
  }

  for (const attr in oldProps) {
    // @ts-ignore
    const oldValue = oldProps[attr]
    // @ts-ignore
    const newValue = newProps[attr]

    if (newValue === undefined && oldValue !== undefined) {
      deleteAttribute(element, attr, oldValue)
    }
  }
}

function setAttribute(
  element: Element,
  namespace: 'svg' | 'dom',
  attr: string,
  value: any,
): void {
  switch (attr) {
    case 'key':
    case 'children':
      break
    case 'className':
      element.setAttribute('class', value)
      break
    case 'value':
      // @ts-ignore
      element[attr] = value
      break
    case 'style':
      setStyles(element as HTMLElement, value)
      break
    case 'ref':
      ;(value as RefObject<unknown>).current = element
      break
    default:
      if (namespace === 'svg' && setSvgAttribute(element, attr, value)) break

      if (attr.startsWith('on')) {
        element.addEventListener(attr.slice(2).toLowerCase(), value)
      } else if (typeof value === 'boolean') {
        if (value) element.setAttribute(attr, '')
        else element.removeAttribute(attr)
      } else {
        element.setAttribute(attr, value)
      }
      break
  }
}

function setSvgAttribute(element: Element, attr: string, value: any) {
  switch (attr) {
    case 'strokeWidth':
      element.setAttribute('stroke-width', value)
      return true
    case 'strokeLinejoin':
      element.setAttribute('stroke-linejoin', value)
      return true
  }

  return false
}

function deleteAttribute(
  element: Element,
  attr: string,
  oldValue: unknown,
): void {
  if (attr.startsWith('on')) {
    element.removeEventListener(attr.slice(2).toLowerCase(), oldValue as any)
  } else if (attr === 'className') {
    element.removeAttribute('class')
  } else if (attr === 'ref') {
    ;(oldValue as RefObject<unknown>).current = null
  } else {
    element.removeAttribute(attr)
  }
}
