# Cottontail 🐇

DOM UI library inspired by React and 2D games. This is intended for those who want to make highly interactive apps but have chosen html/css as the rendering layer for whatever reason.

Features:
- Predictable cross-component reactive state. No need for prop drilling or complicated context hacks.
- State management and rendering are designed as one, resulting in better performance.
- Efficient re-rendering, supporting 120 fps. Cottontail only updates the components that need to be, and only once per frame
- Just a few kilobytes of Javascript

Non-features:
 - Server-side rendering


```tsx
import {createElement, init$, Custom, renderRoot} from './index'

class Store {
  // '$' as first the character creates a reactive value.
  // These can be put on classes or components.
  // Only the components that use these variables will be updated when they are modified.
  $num = 2

  constructor() {
    // Converts any fields starting with '$' into reactive values.
    init$(this)
  }

  get square() {
    return this.$num ** 2
  }
}

// A Custom component re-renders when any reactive values it uses are modified, 
//  no more than once per frame.
class App extends Custom<{
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

## Function Components

```tsx
import {createElement, init$, renderRoot} from './index'

class Store {
  $numClicks = 0

  constructor() {
    init$(this)
  }

  onClick = () => {
    this.$numClicks++
  }
}

function Button({store}: {store: Store}) {
  return (
    <button onClick={store.onClick}>
      num clicks: {store.$numClicks}
    </button>
  )
}

renderRoot(<Button store={new Store()} />, document.getElementById('root'))
```

## Reactions

### Reaction.auto

```ts
import {Reaction, init$} from "./index";

class Store {
  $num = 0

  constructor() {
    // Make any field starting with '$' and observable
    init$(this)
    
    Reaction.auto(() => {
      // Logs $num every time it changes
      console.log(this.$num)

      // 'this' is required for connecting the lifetime of this reaction to the store.
      // When 'Store' is no longer used and garbage collected, the reaction will also stop and go away.
      // The is more convenient than typical JS event handlers that need to be manually stopped.
    }, this) 
    
  }

  incrementNum() {
    this.$num++
  }
}
```

### Reaction.value

```ts
import {Reaction, init$} from "./index";

class Store {
  $num = 0
  
  constructor() {
    init$(this)
    
    Reaction.value(() => this.$num % 2 === 0, () => {
      // Logs $num if it's an even whole number every time it changes.
      console.log(this.$num)
    }, this)
  }

  incrementNum() {
    this.$num++
  }
}
```

### Reaction.object

```ts
import {Reaction, init$} from "./index";

class Store {
  $object = {a: 4, b: 'b'}
  
  constructor() {
    init$(this)
    
    Reaction.object(() => this.$object, () => {
      // Logs object only if any fields 1 level deep are changed.
      console.log(this.$object)
    }, this)
  }

  updateObject() {
    this.$object = {a: 5, b: 'b'}
  }
}
```
