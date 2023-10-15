import {ReqFrame} from './render'
import {createElement} from '../jsx'

describe('render', () => {
  test('simple', () => {
    const req = new ReqFrame(document.body)

    req.render(<div />)
  })
})
