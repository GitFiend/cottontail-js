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
    <div></div>
  </div>,
  document.getElementById('root'),
)
