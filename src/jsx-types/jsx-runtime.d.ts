import * as React from './index'
import {CustomMeta, Meta} from '../lib/create-element'

export namespace JSX {
  type ElementType = React.JSX.ElementType

  // interface Element extends React.JSX.Element {}
  interface Element extends Meta {}

  interface ElementClass extends CustomMeta {}

  interface ElementAttributesProperty
    extends React.JSX.ElementAttributesProperty {}

  interface ElementChildrenAttribute
    extends React.JSX.ElementChildrenAttribute {}

  type LibraryManagedAttributes<C, P> = React.JSX.LibraryManagedAttributes<C, P>

  interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}

  interface IntrinsicClassAttributes<T>
    extends React.JSX.IntrinsicClassAttributes<T> {}

  interface IntrinsicElements extends React.JSX.IntrinsicElements {}
}
