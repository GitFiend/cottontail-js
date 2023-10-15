import {CustomComponent} from '../lib/component'
import {createElement} from '../create-element'
import {reqFrame} from '../index'

class Store {
  num = 4

  get square() {
    return this.num ** 2
  }

  getOtherNumber(): number {
    return this.num ** 3
  }
}

class Numbers extends CustomComponent<{store: Store}> {
  selectState() {
    const {store} = this.props
    const {num, square} = store

    return {num, square, otherNum: store.getOtherNumber()}
  }

  render() {
    const {num, square} = this.selectState()

    return (
      <div>
        <h1>Numbers</h1>
        <ul>
          <li>Num: {num}</li>
          <li>Square: {square}</li>
        </ul>

        <button
          onClick={() => {
            this.props.store.num++
            reqFrame()
          }}
        >
          Add
        </button>
      </div>
    )
  }
}

function runApp() {
  const store = new Store()

  return <Numbers store={store} />
}
