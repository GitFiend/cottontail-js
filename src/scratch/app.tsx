import {createElement} from '../create-element'
import {renderRoot} from '../lib/cottontail'
import {$Component} from '../lib/components/custom-component'
import {charge$Runes} from '../lib/model/model'

class Store {
  $num = 0

  constructor() {
    charge$Runes(this)
  }

  get square() {
    return this.$num ** 2
  }

  onClick = () => {
    this.$num++
  }
}

class Thing extends $Component<{store: Store}> {
  render() {
    const {store} = this.props

    return (
      <div
        style={{
          width: `100px`,
          height: `100px`,
          background: 'red',
        }}
      >
        <span style={{fontSize: '100px'}}>Hello</span>
        <button style={{width: '120px'}} onClick={store.onClick}>
          {`Num Clicks: ${store.$num}, square: ${store.square}`}
        </button>
      </div>
    )
  }
}

const store = new Store()

renderRoot(
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
