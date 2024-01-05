import {createElement} from '../create-element'
import {renderRoot} from '../cottontail'
import {Custom} from '../components/custom-component'

describe('render', () => {
  test('simple', () => {
    renderRoot(<div className="Omg" />, document.body)

    expect(document.body.children.length).toEqual(1)
  })

  test('children in component', () => {
    renderRoot(
      <div className="Omg">
        <div className="Omg2" />
      </div>,
      document.body,
    )

    expect(document.body.children.length).toEqual(1)
    expect(document.body.children[0].children.length).toEqual(1)
  })

  test('multiple children in component', () => {
    const children = [<div className="Omg2" />, <div className="Omg3" />]

    renderRoot(<div className="Omg">{children}</div>, document.body)

    expect(document.body.children.length).toEqual(1)
    expect(document.body.children[0].children.length).toEqual(2)
  })

  test('multiple children in custom component', () => {
    class Comp extends Custom<{children: JSX.Element[]}> {
      render() {
        return <div className="Omg">{this.props.children}</div>
      }
    }

    renderRoot(
      <Comp>
        <div className="Omg2" />
        <div className="Omg3" />
      </Comp>,
      document.body,
    )

    expect(document.body.children.length).toEqual(1)
    expect(document.body.children[0].children.length).toEqual(2)
  })
})
