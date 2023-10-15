import {createElement} from '../jsx'

describe('simple div', () => {
  test('div with no props gets transformed', () => {
    const div = <div />

    expect(div).toEqual({name: 'div', props: null})
  })
})
