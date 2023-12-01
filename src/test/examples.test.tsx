import {createElement, Fragment} from '../lib/create-element'
import {JSX} from '../jsx-types'

describe('simple div', () => {
  test('div with no props gets transformed', () => {
    expect(<div />).toEqual(createElement('div', null))
  })

  test('Custom component with no props gets transformed', () => {
    function Omg(_props: {}) {
      return null
    }

    expect(<Omg />).toEqual(createElement(Omg, null))
  })

  test('Custom component with child gets transformed', () => {
    function Omg(_props: {children: JSX.Element}) {
      return null
    }

    expect(
      <Omg>
        <div />
      </Omg>,
    ).toEqual(createElement(Omg, null, createElement('div', null)))
  })

  test('div with 2 children transformed', () => {
    expect(
      <div>
        <div />
        <div />
      </div>,
    ).toEqual(
      createElement('div', null, createElement('div', null), createElement('div', null)),
    )
  })

  test('Fragment with child gets transformed', () => {
    expect(
      <>
        <div />
      </>,
    ).toEqual(createElement(Fragment, null, createElement('div', null)))
  })
})
