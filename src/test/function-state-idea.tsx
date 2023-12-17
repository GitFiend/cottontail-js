import {createElement} from '../lib/create-element'

// Idea if classes get discontinued in JSX.
function Test(props: {name: string}) {
  const {self, $num, square} = model(() => ({
    $num: -1,
    get square() {
      return self.$num
    },
    set square(num: number) {
      self.$num = num * num
    },
    onClick: () => {
      self.square++
    },
  }))

  return (
    <div onClick={self.onClick}>
      <h1>{props.name}</h1>
      Num: {$num}, Square: {square}
      <button onClick={self.onClick}>Click Me</button>
    </div>
  )
}

function run() {
  return <Test name="MyApp" />
}

// This only runs on component mount. We return the previous result on update.
function model<T>(init: () => T): T & {self: T} {
  // Init the observables.

  // @ts-ignore
  return init()
}

function some<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

function check(n: number | null) {
  let a: number = some(n) ? n : 0

  if (some(n)) {
    const b: number = n
  }

  // if (n ?? false) {
  //   const b: number = n
  // }
}
