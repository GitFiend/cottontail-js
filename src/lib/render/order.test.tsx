import {Order} from './order'
import {Dom, DomComponent} from '../components/dom-component'
import {mkRoot} from './util'
import {createElement} from '../create-element'
import {GlobalStack} from '../model/global-stack'
import {ElementComponent} from '../components/types'

describe('Order.add comparisons', () => {
  test('1.1 < 1.2', () => {
    expect(Order.key('1', 1) < Order.key('1', 2)).toBe(true)
  })

  test('1 3 < 1 20', () => {
    expect(Order.key('1', 3) < Order.key('1', 20)).toBe(true)
  })
})

describe('insert', () => {
  const root = mkRoot(<div />)

  const parent = root.root.inserted[0] as DomComponent
  const {inserted} = parent

  test('try different insert indices', () => {
    Dom.newComponent(<div />, parent, parent, 3)
    GlobalStack.drawFrame()
    expect(inserted.map(i => i.order)).toEqual(['103'])
    checkOrder(inserted)

    Dom.newComponent(<div />, parent, parent, 4)
    GlobalStack.drawFrame()
    expect(inserted.map(i => i.order)).toEqual(['103', '104'])
    checkOrder(inserted)

    Dom.newComponent(<div />, parent, parent, 1)
    GlobalStack.drawFrame()
    expect(inserted.map(i => i.order)).toEqual(['101', '103', '104'])
    checkOrder(inserted)

    Dom.newComponent(<div />, parent, parent, 2)
    GlobalStack.drawFrame()
    expect(inserted.map(i => i.order)).toEqual(['101', '102', '103', '104'])
    checkOrder(inserted)
  })
})

export function checkOrder(inserted: ElementComponent[]) {
  let prev: ElementComponent | null = null

  for (const c of inserted) {
    if (prev !== null) {
      expect(prev.element).toBe(c.element.previousElementSibling)
    }
    prev = c
  }
}
