import {mkRoot} from '../render/util'
import {Fragment} from './fragment'
import {createElement} from '../create-element'
import {Custom} from './custom-component'
import {init$} from '../model/init-observables'
import {GlobalStack} from '../model/global-stack'

describe('fragment', () => {
  test('one host child', () => {
    const t = (
      <>
        <div>omg</div>
      </>
    )
    const root = mkRoot(t)

    expect(root.element.innerHTML).toEqual('<div>omg</div>')
  })

  test('custom component child', () => {
    class C extends Custom {
      render() {
        return <div>omg</div>
      }
    }

    const root = mkRoot(<C />)

    expect(root.element.innerHTML).toEqual('<div>omg</div>')
  })

  test('multiple children', () => {
    const root = mkRoot(
      <>
        <div>a</div>
        <div>b</div>
        <div>c</div>
      </>,
    )

    expect(root.element.innerHTML).toEqual(
      '<div>a</div><div>b</div><div>c</div>',
    )

    root.rerender(
      <>
        <div>a</div>
        <div>b</div>
        <div>c</div>
        <div>d</div>
      </>,
    )

    expect(root.element.innerHTML).toEqual(
      '<div>a</div><div>b</div><div>c</div><div>d</div>',
    )

    root.rerender(
      <>
        <div>d</div>
        <div>a</div>
        <div>b</div>
        <div>c</div>
      </>,
    )

    expect(root.element.innerHTML).toEqual(
      '<div>d</div><div>a</div><div>b</div><div>c</div>',
    )
  })

  test('custom component with fragment', () => {
    class S {
      $text = 'text1'

      constructor() {
        init$(this)
      }
    }

    class C extends Custom<{store: S}> {
      render() {
        return <div key="container">{this.props.store.$text}</div>
      }
    }

    const s = new S()
    const root = mkRoot(<C store={s} />)

    expect(root.element.innerHTML).toEqual('<div>text1</div>')

    s.$text = 'text2'
    GlobalStack.drawFrame()
    expect(root.element.innerHTML).toEqual('<div>text2</div>')

    s.$text = 'text3'
    GlobalStack.drawFrame()
    expect(root.element.innerHTML).toEqual('<div>text3</div>')
  })

  test('fragment with array becoming empty', () => {
    class Store {
      $haveStuff = true
      constructor() {
        init$(this)
      }
    }
    class A extends Custom<{store: Store}> {
      render() {
        return (
          <div>
            <>{this.drawStuff()}</>
          </div>
        )
      }

      drawStuff() {
        return this.props.store.$haveStuff ? [<div>a</div>, <div>b</div>] : []
      }
    }

    const store = new Store()
    const root = mkRoot(<A store={store} />)

    expect(root.element.innerHTML).toEqual(
      '<div><div>a</div><div>b</div></div>',
    )

    store.$haveStuff = false
    GlobalStack.drawFrame()

    expect(root.element.innerHTML).toEqual('<div></div>')
  })
})
