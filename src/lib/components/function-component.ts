import {Meta} from '../create-element'
import {AnyComponent, ParentComponent, Props} from './types'
import {RootComponent} from './root-component'
import {DomComponent} from './dom-component'
import {Order} from '../render/order'

interface FunctionComponent {
  kind: 'function'
  renderFunction: (props: Props) => Meta
  props: Props
  order: string
  key: string
  directParent: ParentComponent
  domParent: DomComponent | RootComponent
  index: number
  subComponent: AnyComponent | null
  __removed: boolean
  __ref: WeakRef<FunctionComponent>
}

const initialRef = new WeakRef<any>({})

function makeFunctionComponent(
  // @ts-ignore
  meta: FunctionMeta,
  directParent: ParentComponent,
  domParent: DomComponent | RootComponent,
  index: number,
) {
  const {props, name} = meta

  const c: FunctionComponent = {
    kind: 'function',
    renderFunction: meta.name as (props: Props) => Meta,
    props: meta.props,
    order: Order.key(directParent.order, index),
    key: props?.key ?? directParent.key + index,
    directParent,
    domParent,
    index,
    subComponent: null,
    __removed: false,
    __ref: initialRef,
  }
  c.__ref = new WeakRef(c)
}

// function runRender(c: FunctionComponent) {
//   if (c.__removed) return
//
//   if (__DEV__) {
//     time(c.renderFunction.name)
//   }
//
//   // TODO: Should this be after the render call?
//   GlobalStack.renderedList.add(c)
//
//   // Get the elements to render. We detect observable calls here?
//   // This goes an on a global stack, so we can track it?
//   GlobalStack.push(c.__ref)
//   const newMeta = c.renderFunction(c.props)
//   GlobalStack.pop()
//
//   if (newMeta !== null) {
//     c.subComponent = Render.component(
//       newMeta,
//       c.subComponent,
//       c,
//       c.domParent,
//       0, // Don't currently support an array render result.
//     )
//   } else if (c.subComponent !== null) {
//     Remove.component(c.subComponent)
//     c.subComponent = null
//   }
//   // TODO: Other cases? 0 and false?
//
//   if (__DEV__) {
//     timeEnd(c.renderFunction.name)
//   }
// }
