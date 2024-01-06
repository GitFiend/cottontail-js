import {Custom} from './custom-component'
import {createElement} from '../create-element'
import {Fragment} from './fragment'
import {mkRoot} from '../render/util'

describe('DomComponent', () => {
  test('nested elements are in the correct order', () => {
    class A extends Custom<{first: number}> {
      render() {
        const {first} = this.props
        const elements = []

        for (let i = first; i < first + 3; i++) {
          elements.push(
            <div key={i}>
              <div>a</div>
              <div>b</div>
              <div>c</div>
            </div>,
          )
        }

        return <>{elements}</>
      }
    }

    const root = mkRoot(<A first={0} />)

    expect(root.element.innerHTML).toEqual(
      '<div><div>a</div><div>b</div><div>c</div></div>'.repeat(3),
    )

    root.rerender(<A first={1} />)

    expect(root.element.innerHTML).toEqual(
      '<div><div>a</div><div>b</div><div>c</div></div>'.repeat(3),
    )
  })
})
