import {createElement} from '../create-element'
import {renderRoot2} from '../lib/cottontail'
import {CustomComponent} from '../lib/components/custom-component'

class Thing extends CustomComponent<{}> {
  state = {
    num: 0,
  }
  selectState(props: {}) {}

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
        <button
          style={{width: '120px'}}
          onClick={() => {
            this.state.num++
            run()
          }}
        >
          {`Num Clicks: ${this.state.num}`}
        </button>
      </div>
    )
  }
}

export const {run} = renderRoot2(
  <div>
    <Thing />
  </div>,
  document.getElementById('root'),
)
