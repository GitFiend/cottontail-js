import {createElement, charge$Runes, $Component, renderRoot} from './index'

class Store {
  // '$' as first character creates an observable.
  $num = 2

  constructor() {
    // Converts any fields starting with '$' into runes.
    charge$Runes(this)
  }

  get square() {
    return this.$num ** 2
  }
}

// A $Component re-renders when any runes are modified, no more than once per frame.
class App extends $Component<{
  store: Store
}> {
  render() {
    const {$num, square} = this.props.store

    return (
      <div>
        Square of {$num} equals {square}
        <button onClick={this.onClick}>Increment</button>
      </div>
    )
  }

  onClick = () => {
    this.props.store.$num++
  }
}

renderRoot(<App store={new Store()} />, document.getElementById('root'))
