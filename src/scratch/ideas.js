import {$Component} from '../lib/components/custom-component'

class Thing extends $Component {
  render() {
    const {$num} = this.props

    div$(
      {
        style: {width: 100, height: 100, background: 'red'},
      },
      div$(),
      div$(),
    )

    return div$({
      style: {width: 100, height: 100, background: 'red'},
      in: [
        button$({
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

function div$() {}
function button$() {}
function style() {}
function width() {}
function height() {}
function children() {}

div$(
  style(width(5), height(10)),
  children(div$(children(div$(), div$(), div$())), button$()),
)

html`<div class="Avatar"><Thing></Thing></div>`

function html(strings, personExp, ageExp) {
  const str0 = strings[0] // "That "
  const str1 = strings[1] // " is a "
  const str2 = strings[2] // "."

  const ageStr = ageExp < 100 ? 'youngster' : 'centenarian'

  // We can even return a string built using a template literal
  return `${str0}${personExp}${str1}${ageStr}${str2}`
}
