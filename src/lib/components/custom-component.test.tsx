import {init$} from '../model/runes'
import {Custom} from './custom-component'
import {createElement} from '../create-element'
import {Cottontail} from '../cottontail'
import {GlobalStack} from '../model/global-stack'
import {mkRoot} from '../render/util'
import {Props} from './types'

describe('Custom', () => {
  test('order 1', () => {
    class Store {
      $num = 5
      constructor() {
        init$(this)
      }
    }

    class A extends Custom<{
      store: Store
      depth: number
    }> {
      render() {
        const {store, depth} = this.props

        if (depth <= 0) return null

        return (
          <div>
            {store.$num} - {depth}
            <A store={store} depth={depth - 1} />
          </div>
        )
      }
    }

    const store = new Store()

    const root = new Cottontail(
      <A store={store} depth={3} />,
      document.createElement('div'),
    )

    expect(root.element.innerHTML).toEqual(
      '<div>5 - 3<div>5 - 2<div>5 - 1</div></div></div>',
    )

    store.$num = 6
    GlobalStack.reRender()

    expect(root.element.innerHTML).toEqual(
      '<div>6 - 3<div>6 - 2<div>6 - 1</div></div></div>',
    )
  })

  test('order without keys', () => {
    const a = (
      <div>
        <div>a</div>
      </div>
    )

    const root = mkRoot(a)

    expect(root.element.innerHTML).toEqual('<div><div>a</div></div>')

    const b = (
      <div>
        <div>b</div>
        <div>a</div>
      </div>
    )

    root.rerender(b)

    expect(root.element.innerHTML).toEqual(
      '<div><div>b</div><div>a</div></div>',
    )
  })

  test('order, no keys, custom component', () => {
    class DivC extends Custom<Props> {
      render() {
        return <div>{this.props.children}</div>
      }
    }

    const a = (
      <DivC>
        <DivC>a</DivC>
      </DivC>
    )

    const root = mkRoot(a)

    expect(root.element.innerHTML).toEqual('<div><div>a</div></div>')

    const b = (
      <DivC>
        <DivC>b</DivC>
        <DivC>a</DivC>
      </DivC>
    )

    root.rerender(b)

    expect(root.element.innerHTML).toEqual(
      '<div><div>b</div><div>a</div></div>',
    )
  })

  test('order 2, without keys', () => {
    const a = (
      <div>
        <div>a</div>
        <div>b</div>
        <div>c</div>
      </div>
    )
    const root = mkRoot(a)

    expect(root.element.innerHTML).toEqual(
      '<div><div>a</div><div>b</div><div>c</div></div>',
    )

    const b = (
      <div>
        <div>d</div>
        <div>a</div>
        <div>b</div>
        <div>c</div>
      </div>
    )

    root.rerender(b)

    expect(root.element.innerHTML).toEqual(
      '<div><div>d</div><div>a</div><div>b</div><div>c</div></div>',
    )
  })

  test('order 3, with keys', () => {
    const a = (
      <div>
        <div key="a">a</div>
        <div key="b">b</div>
        <div key="c">c</div>
      </div>
    )

    const root = mkRoot(a)

    expect(root.element.innerHTML).toEqual(
      '<div><div>a</div><div>b</div><div>c</div></div>',
    )

    const b = (
      <div>
        <div key="d">d</div>
        <div key="a">a</div>
        <div key="b">b</div>
        <div key="c">c</div>
      </div>
    )

    root.rerender(b)

    expect(root.element.innerHTML).toEqual(
      '<div><div>d</div><div>a</div><div>b</div><div>c</div></div>',
    )
  })
})
