import {createElement, Meta} from '../create-element'
import {Custom} from '../components/custom-component'
import {mkRoot} from './util'

describe('render', () => {
  test('simple', () => {
    const root = mkRoot(<div className="Omg" />)

    expect(root.element.children.length).toEqual(1)
  })

  test('children in component', () => {
    const root = mkRoot(
      <div className="Omg">
        <div className="Omg2" />
      </div>,
    )

    expect(root.element.children.length).toEqual(1)
    expect(root.element.children[0].children.length).toEqual(1)
  })

  test('multiple children in component', () => {
    const children = [<div className="Omg2" />, <div className="Omg3" />]

    const root = mkRoot(<div className="Omg">{children}</div>)

    expect(root.element.innerHTML).toEqual(
      '<div class="Omg"><div class="Omg2"></div><div class="Omg3"></div></div>',
    )

    expect(root.element.children.length).toEqual(1)
    expect(root.element.children[0].children.length).toEqual(2)
  })

  test('multiple children in custom component', () => {
    class Comp extends Custom<{children: Meta[]}> {
      render() {
        return <div className="Omg">{this.props.children}</div>
      }
    }

    const root = mkRoot(
      <Comp>
        <div className="Omg2" />
        <div className="Omg3" />
      </Comp>,
    )

    expect(root.element.children.length).toEqual(1)
    expect(root.element.children[0].children.length).toEqual(2)
  })

  test('svg elements', () => {
    const root = mkRoot(
      <svg>
        <line x1={0} x2={10} y1={0} y2={10}></line>
      </svg>,
    )

    expect(root.element.innerHTML).toEqual(
      '<svg><line x1="0" x2="10" y1="0" y2="10"></line></svg>',
    )
  })

  xtest('render order assumptions', () => {
    class A extends Custom {
      render() {
        console.log('make A meta')
        const res = (
          <div>
            <B />
          </div>
        )
        console.log('after A meta')

        return res
      }
    }

    class B extends Custom {
      render(): Meta {
        console.log('make B meta')
        const res = <div></div>
        console.log('after B meta')

        return res
      }
    }

    const root = mkRoot(<A />)

    /*
    Prints

    make A meta
    after A meta
    make B meta
    after B meta

     */

    expect(root.element.innerHTML).toEqual(`<div><div></div></div>`)
  })
})
