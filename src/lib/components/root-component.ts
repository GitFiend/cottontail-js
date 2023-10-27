import {Component} from './custom-component'

export class RootComponent {
  component: Component | null = null

  order = '1'
  key = 'root'

  constructor(public element: HTMLElement) {}
}
