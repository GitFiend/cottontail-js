import {createElement} from '../lib/create-element'

// Some ideas if classes get discontinued in JSX.

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

// We could use a closure to hold the component state.
// This means we don't need to do memo stuff etc.
// How do we handle changed props? We don't want to rerun the function.
// Don't want to get into higher order components territory.
function Test3(props: {name: string}) {
  const {name} = props

  const num = observable(34)

  const onClick = () => {
    num(num() + 1)
  }
  return () => <div onClick={onClick}>{name}</div>
}

// Mock observable. Ignore implementation.
function observable<T>(value: T): any {
  return value
}

function Test2(props: {name: string}) {
  const {self, $num, square} = model2(
    class {
      $num = 34
      square = () => {
        return this.$num ** 2
      }
      onClick = () => {
        this.$num++
      }
    },
  )

  return (
    <div onClick={self.onClick}>
      <h1>{props.name}</h1>
      Num: {$num}, Square: {self.square()}
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

// This only runs on component mount. We return the previous result on update.
function model2<T>(init: new () => T): T & {self: T} {
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
