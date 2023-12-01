import {createElement} from '../create-element'
import {renderRoot} from '../cottontail'

describe('render', () => {
  test('simple', () => {
    renderRoot(<div className="Omg" />, document.body)

    expect(document.body.children.length).toEqual(1)
  })
})
