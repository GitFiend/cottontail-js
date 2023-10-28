import {createElement} from '../create-element'
import {renderRoot} from '../lib/cottontail'

renderRoot(
  <div>
    <div
      style={{
        width: `100px`,
        height: `100px`,
        background: 'red',
        zIndex: 0,
      }}
    >
      <span style={{fontSize: '100px'}}>Hello</span>
      <span>hi</span>
    </div>
  </div>,
  document.getElementById('root'),
)