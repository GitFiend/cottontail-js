import {createElement} from '../create-element'
import {renderRoot2} from '../lib/cottontail'
import {CustomComponent} from '../lib/components/custom-component'

class Thing extends CustomComponent<{}> {
  state = {
    num: 0,
  }
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
        <button
          onClick={() => {
            console.log('heelo', this.state)
            this.state.num++
            run()
          }}
        >
          {this.state.num.toString()}
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
