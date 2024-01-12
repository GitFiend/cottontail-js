import {Custom} from '../components/custom-component'
import {createElement, Meta} from '../create-element'
import {mkRoot} from './util'

describe('Reusing meta objects', () => {
  test('', () => {
    class A extends Custom<{children: Meta | Meta[]}> {
      render() {
        return <div>{this.props.children}</div>
      }
    }

    class B extends Custom {
      render(): Meta {
        return <div></div>
      }
    }

    const root = mkRoot(
      <A>
        <B />
      </A>,
    )
    expect(root.element.innerHTML).toEqual(`<div><div></div></div>`)

    root.rerender(null)
    expect(root.element.innerHTML).toEqual(``)

    root.rerender(
      <A>
        <B />
      </A>,
    )
    expect(root.element.innerHTML).toEqual(`<div><div></div></div>`)
  })
})
