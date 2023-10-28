import {createElement} from '../create-element'
import {renderRoot} from '../lib/cottontail'
import {Component} from '../lib/components/custom-component'

class Thing extends Component<{}> {
  state = {
    num: 0,
  }

  render() {
    return (
      <div
        style={{
          width: `100px`,
          height: `100px`,
          background: 'red',
        }}
      >
        <span style={{fontSize: '100px'}}>Hello</span>
        <button style={{width: '120px'}} onClick={this.onClick}>
          {`Num Clicks: ${this.state.num}`}
        </button>
      </div>
    )
  }

  onClick = () => {
    this.state.num++
    render()
  }
}

export const {render} = renderRoot(
  <div>
    <Thing />
  </div>,
  document.getElementById('root'),
)
