import {renderRoot} from '../lib/cottontail'
import {$Component} from '../lib/components/custom-component'
import {charge$Runes} from '../lib/model/model'
import {createElement} from '../lib/create-element'

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
          width: 100,
          height: 100,
          background: 'red',
        }}
      >
        <span style={{fontSize: 100}}>Hello</span>
        <button style={{width: 120}} onClick={store.onClick}>
          Num Clicks: {store.$num}, square: {store.square}
        </button>
      </div>
    )
  }
}

const store = new Store()

renderRoot(
  <div style={{display: 'flex', flexDirection: 'column'}}>
    <h1>Hi</h1>
    {Array.from({length: 10}).map((_, i) => {
      return (
        <div style={{height: 150}} key={i}>
          <Thing store={store} />
        </div>
      )
    })}
  </div>,
  document.getElementById('root'),
)
