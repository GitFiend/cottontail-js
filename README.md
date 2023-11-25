# Cottontail 🐇

DOM UI library inspired by React and 2D game engines.

*This is a proof of concept. I may use this for GitFiend, but maybe a Rust or ScalaJs version.*

Features:
- Predictable cross-component reactive state. No need for prop drilling or complicated context hacks
- Efficient re-rendering, supporting 120 fps. Cottontail only updates the components that need to be, and only once per frame
- Just a few kilobytes of Javascript

Non-features:
 - Server-side rendering


```tsx
import {createElement, charge$Runes, $Component, renderRoot} from './index'

class Store {
  // '$' as first the character creates a reactive value.
  // These can be put on classes or components.
  // Only the components that use these variables will be updated when they are modified.
  $num = 2

  constructor() {
    // Converts any fields starting with '$' into reactive values.
    charge$Runes(this)
  }

  get square() {
    return this.$num ** 2
  }
}

// A $Component re-renders when any reactive values it uses are modified, 
//  no more than once per frame.
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

```