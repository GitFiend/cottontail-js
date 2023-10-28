import {createElement} from '../create-element'
import {renderRoot} from '../lib/cottontail'
import {CustomComponent} from '../lib/components/custom-component'

class Thing extends CustomComponent {
  state = {}
  selectState(props: {}) {
    return {}
  }

  render() {
    return (
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
    )
  }
}

renderRoot(
  <div>
    <Thing />
  </div>,
  document.getElementById('root'),
)
