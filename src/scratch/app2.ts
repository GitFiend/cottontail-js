import {Custom} from '../lib/components/custom-component'
import {createElement} from '../lib/create-element'

class App2 extends Custom<{}> {
  render() {
    return createElement('div', {})
  }
}
