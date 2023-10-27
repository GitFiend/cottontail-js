import {CustomComponent} from '../lib/components/custom-component'
import {createElement} from '../create-element'
import {requestFrame} from '../index'
import {Cottontail} from '../lib/render'

class Store {
  num = 4

  get square() {
    return this.num ** 2
  }

  getOtherNumber(): number {
    return this.num ** 3
  }
}

interface NumbersProps {
  store: Store
}

interface NumbersState {
  num: number
  square: number
  otherNum: number
  on: boolean
}

class Numbers extends CustomComponent<NumbersProps, NumbersState> {
  // Just declare type here instead of passing it to CustomComponent?
  state = {
    num: 0,
    square: 0,
    otherNum: 0,
    on: false,
  }

  selectState() {
    const {store} = this.props

    this.state.num = store.num
    this.state.square = store.square
    this.state.otherNum = store.getOtherNumber()
  }

  render() {
    const {num, square} = this.state

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
const reqFrame = new Cottontail(document.body)

const store = new Store()

reqFrame.render(<Numbers store={store} />)
