import {createElement} from '../create-element'
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

    expect(root.element.children.length).toEqual(1)
    expect(root.element.children[0].children.length).toEqual(2)
  })

  test('multiple children in custom component', () => {
    class Comp extends Custom<{children: JSX.Element[]}> {
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
})
