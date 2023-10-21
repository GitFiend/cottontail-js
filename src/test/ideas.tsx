import {CustomComponent} from '../lib/component'
import {createElement} from '../create-element'
import {requestFrame} from '../index'
import {ReqFrame} from '../lib/render'

class Store {
  num = 4

  get square() {
    return this.num ** 2
  }

  getOtherNumber(): number {
    return this.num ** 3
  }
}

class Numbers extends CustomComponent<Numbers, {store: Store}> {
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

            // App will re-render on next monitor frame.
            requestFrame()
          }}
        >
          Add
        </button>
      </div>
    )
  }
}

// Run app
const reqFrame = new ReqFrame(document.body)

const store = new Store()

reqFrame.render(<Numbers store={store} />)
