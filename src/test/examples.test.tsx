import {createElement} from '../jsx'
import {JSX} from 'react'

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

  test('Custom component with children gets transformed', () => {
    function Omg(_props: {children: JSX.Element}) {
      return null
    }

    expect(
      <Omg>
        <div />
      </Omg>,
    ).toEqual(createElement(Omg, null, createElement('div', null)))
  })
})
