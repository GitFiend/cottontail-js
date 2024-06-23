import {Custom} from '../components/custom-component'
import {createElement, Meta} from '../create-element'
import {mkRoot} from './util'
import {Fragment} from '../components/fragment'

describe('test re-rendering keyed lists', () => {
  test('plain divs with keys', () => {
    const num = 20

    class Scroller extends Custom<{n: number}> {
      render() {
        const {n} = this.props

        const elements: Meta[] = []

        for (let i = 0; i < num; i++) {
          const s = `${n + i}`

          elements.push(<div key={s}>{s}</div>)
        }

        return <>{elements}</>
      }
    }

    let n = 0
    const root = mkRoot(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))

    n = 10
    root.rerender(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))

    n = 5
    root.rerender(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))
  })

  test('divs without keys', () => {
    const num = 4

    class Scroller extends Custom<{n: number}> {
      render() {
        const {n} = this.props

        const elements: Meta[] = []

        for (let i = 0; i < num; i++) {
          const s = `${n + i}`

          elements.push(<div>{s}</div>)
        }

        return <>{elements}</>
      }
    }

    let n = 0
    const root = mkRoot(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))

    // Scroll forward
    n = 6
    root.rerender(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))

    // Scroll backward
    n = 5
    root.rerender(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))

    // Scroll backward
    n = 4
    root.rerender(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))

    // Scroll backward
    n = 3
    root.rerender(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))
  })

  test('wrapped divs', () => {
    const num = 3

    class DivC extends Custom<{text: string}> {
      render() {
        return <div>{this.props.text}</div>
      }
    }

    class Scroller extends Custom<{n: number}> {
      render() {
        const {n} = this.props

        const elements: Meta[] = []

        for (let i = 0; i < num; i++) {
          const s = `${n + i}`

          elements.push(<DivC key={s} text={s} />)
        }

        return <>{elements}</>
      }
    }

    let n = 0
    const root = mkRoot(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))

    n = 9
    root.rerender(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))

    n = 8
    root.rerender(<Scroller n={n} />)
    expect(root.element.innerHTML).toEqual(result(n, num))
  })
})

const result = (index: number, numDivs: number): string => {
  let r = ''

  for (let i = 0; i < numDivs; i++) {
    r += `<div>${index + i}</div>`
  }
  return `<div style="display: contents;">${r}</div>`
}
