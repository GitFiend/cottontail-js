import {createElement, Meta} from '../create-element'
import {mkRoot} from '../render/util'
import {Custom} from './custom-component'
import {init$} from '../model/init-observables'
import {GlobalStack} from '../model/global-stack'

describe('function components', () => {
  xtest('detect component type', () => {
    const num = 1000_000

    function A() {
      return <div>Hi</div>
    }

    class B extends Custom {
      render(): Meta {
        return <div></div>
      }
    }

    class C extends B {}

    expect(A.constructor.name).toBe('Function')
    expect(B.constructor.name).toBe('Function')

    // @ts-ignore
    expect(A.__proto__.name).toBe('')
    // @ts-ignore
    expect(B.__proto__.name).toBe('Custom')
    // @ts-ignore
    expect(C.__proto__.name).toBe('B')

    const funcs: any[] = []
    const classes: any[] = []

    for (let i = 0; i < num; i++) {
      funcs.push(() => {})
      classes.push(
        class extends Custom {
          render() {
            return <div></div>
          }
        },
      )
    }

    let n = 0
    console.time('use __proto__')
    for (let i = 0; i < num; i++) {
      if (funcs[i].__proto__.name === '' && classes[i].__proto__.name !== '') {
        n++
      }
    }
    console.timeEnd('use __proto__')
    expect(n).toBe(num)

    n = 0
    console.time('use isPrototypeOf')
    for (let i = 0; i < num; i++) {
      if (!Custom.isPrototypeOf(funcs[i]) && Custom.isPrototypeOf(classes[i])) {
        n++
      }
    }
    console.timeEnd('use isPrototypeOf')
    expect(n).toBe(num)

    n = 0
    console.time('name lookup')
    for (let i = 0; i < num; i++) {
      if (funcs[i].name === '' && classes[i].name === '') {
        n++
      }
    }
    console.timeEnd('name lookup')
    expect(n).toBe(num)
  })

  test('Very simple function component renders', () => {
    function Thing() {
      return <div>Hi</div>
    }

    const root = mkRoot(<Thing />)
    expect(root.element.innerHTML).toBe('<div>Hi</div>')
  })

  test('Function component with props', () => {
    function Button(props: {
      onClick: (e: MouseEvent) => void
      children?: Meta[] | Meta
    }) {
      return <button onClick={props.onClick}>{props.children}</button>
    }

    const root = mkRoot(<Button onClick={(_: MouseEvent) => {}}>Hello</Button>)

    expect(root.element.innerHTML).toEqual('<button>Hello</button>')
  })

  test('Function component updates when observables update', () => {
    class Store {
      $num = 0

      constructor() {
        init$(this)
      }

      onClick = () => {
        this.$num++
      }
    }

    function Button({store}: {store: Store}) {
      return <button onClick={store.onClick}>{store.$num}</button>
    }

    const store = new Store()
    const root = mkRoot(<Button store={store} />)

    expect(root.element.innerHTML).toEqual('<button>0</button>')

    store.onClick()
    GlobalStack.drawFrame()

    expect(root.element.innerHTML).toEqual('<button>1</button>')
  })
})
