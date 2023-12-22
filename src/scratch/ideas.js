import {$Component} from '../lib/components/custom-component'

class Thing extends $Component {
  render() {
    const {$num} = this.props

    return $.div({
      style: {width: 100, height: 100, background: 'red'},
      in: [
        $.span({style: {fontSize: 100}}),
        $.button({
          onClick: () => {
            console.log('click')
          },
        }),
        Button.$({
          onClick: () => {
            this.props.$num++
          },
          in: [`Num clicks: ${$num}`],
        }),
      ],
    })
  }
}

function span$() {}
function div$() {}
function button$() {}
function Button() {}

const $ = {
  div: () => {},
  span: () => {},
  button: () => {},
}
