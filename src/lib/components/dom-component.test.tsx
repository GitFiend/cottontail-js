import {Custom} from './custom-component'
import {createElement} from '../create-element'
import {Fragment} from './fragment'
import {mkRoot} from '../render/util'

describe('DomComponent', () => {
  test('nested elements are in the correct order', () => {
    const rep = 2

    class A extends Custom<{first: number}> {
      render() {
        const {first} = this.props
        const elements = []

        for (let i = first; i < first + rep; i++) {
          elements.push(
            <div key={i}>
              <span>a</span>
              <span>b</span>
            </div>,
          )
        }

        return <>{elements}</>
      }
    }

    const root = mkRoot(<A first={0} />)

    expect(root.element.innerHTML).toEqual(
      '<div><span>a</span><span>b</span></div>'.repeat(rep),
    )

    root.rerender(<A first={1} />)

    expect(root.element.innerHTML).toEqual(
      '<div><span>a</span><span>b</span></div>'.repeat(rep),
    )
  })
})
