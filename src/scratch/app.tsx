import {render} from '../lib/render'
import {createElement} from '../create-element'

render(
  <div
    style={{
      width: `100px`,
      height: `100px`,
      background: 'red',
    }}
  >
    <span style={{fontSize: '100px'}}>Hello</span>
  </div>,
  document.getElementById('root'),
)
