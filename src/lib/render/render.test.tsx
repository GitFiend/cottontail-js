import {createElement} from '../../create-element'
import {Cottontail, renderRoot} from '../cottontail'

describe('render', () => {
  test('simple', () => {
    renderRoot(<div className="Omg" />, document.body)

    expect(document.body.children.length).toEqual(1)
  })
})
