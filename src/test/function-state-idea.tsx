import {createElement} from '../lib/create-element'

// Idea if classes get discontinued in JSX.
function Test() {
  const state = useState(() => ({
    $num: -1,
    get square() {
      return state.$num
    },
  }))

  const {$num, square} = state

  return (
    <div>
      Num: {$num}, Square: {square}
    </div>
  )
}

function useState<T>(init: () => T): T {
  // Only call this the first time.
  // Init the observables.
  return init()
}
