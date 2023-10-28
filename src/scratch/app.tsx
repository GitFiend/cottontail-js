import {createElement} from '../create-element'
import {renderRoot} from '../lib/cottontail'
import {Component} from '../lib/components/custom-component'

class Store {
  num = 0

  get square() {
    return this.num ** 2
  }

  onClick = () => {
    this.num++
    render()
  }
}

class Thing extends Component<{store: Store}> {
  state = {
    num: 0,
  }

  selectState(props: {store: Store}) {
    this.state.num = props.store.num
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
        <button style={{width: '120px'}} onClick={this.props.store.onClick}>
          {`Num Clicks: ${this.state.num}, square: ${this.props.store.square}`}
        </button>
      </div>
    )
  }
}

const store = new Store()

export const {render} = renderRoot(
  <div style={{display: 'flex', flexDirection: 'column'}}>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
    <div style={{height: '150px'}}>
      <Thing store={store} />
    </div>
  </div>,
  document.getElementById('root'),
)
