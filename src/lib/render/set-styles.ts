import {CSSProperties} from '../../jsx-types'

export function setStyles(element: HTMLElement, styles: CSSProperties) {
  for (const style in styles) {
    console.log(style)
    element.style[style as any] = (styles as any)[style]
  }
}
