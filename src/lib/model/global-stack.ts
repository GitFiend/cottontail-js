import {Custom} from '../components/custom-component'
import {Reaction} from './reactions'
import {DomComponent} from '../components/dom-component'
import {RootComponent} from '../components/root-component'
import {applyInserts} from '../render/order'
import {time, timeEnd} from '../render/util'

export class GlobalStack {
  private static currentComponentOrReaction: WeakRef<Custom | Reaction>[] = []
  private static dirtyReactions = new Set<WeakRef<Reaction>>()
  private static dirtyComponents = new Set<WeakRef<Custom>>()

  static insertsStack = new Set<RootComponent | DomComponent>()

  static didMountStack = new Set<WeakRef<Custom>>()
  static didUpdateStack = new Set<WeakRef<Custom>>()

  static push(componentRef: WeakRef<Custom | Reaction>) {
    this.currentComponentOrReaction.push(componentRef)
  }

  static pop() {
    this.currentComponentOrReaction.pop()
  }

  static getCurrent(): WeakRef<Custom | Reaction> | null {
    return (
      this.currentComponentOrReaction[
        this.currentComponentOrReaction.length - 1
      ] ?? null
    )
  }

  static markDirty(componentRef: WeakRef<Custom | Reaction>) {
    const value = componentRef.deref()

    if (value) {
      if (value.kind === 'custom') {
        this.dirtyComponents.add(componentRef as WeakRef<Custom>)
      } else {
        this.dirtyReactions.add(componentRef as WeakRef<Reaction>)
      }
    }

    this.queueRender()
  }

  private static queued = false
  private static queueRender(): void {
    if (this.queued) return
    this.queued = true

    requestAnimationFrame(this.drawFrame)
  }

  // We track which components have already updated this frame.
  // Components could update due to props changed, or runes.
  // We assume props updates will happen before rune updates.
  // If the component has updated due to props changed, we don't need to rerun
  static renderedList = new Set<Custom>()

  // Only used while rendering. We don't want to create a new array every time.
  private static readonly renderList: Custom[] = []

  static drawFrame = () => {
    const {renderList, renderedList} = this

    time('🐇Reactions')
    while (this.dirtyReactions.size > 0) {
      const i = this.dirtyReactions.values().next()

      if (!i.done) {
        const v = i.value
        this.dirtyReactions.delete(v)
        v.deref()?.run()

        if (__DEV__) {
          if (this.dirtyReactions.has(v)) {
            console.warn(
              'This reaction causes a cycle. Running it causes itself to rerun the next frame',
              v.deref()?.name,
              v,
            )
            this.dirtyReactions.delete(v)
          }
        }
      }
    }
    timeEnd('🐇Reactions')

    for (const cRef of this.dirtyComponents.values()) {
      const c = cRef.deref()

      if (c) {
        renderList.push(c)
      }
    }

    this.dirtyComponents.clear()

    // TODO: Check this
    renderList.sort((a, b) => a.order.localeCompare(b.order))

    for (const c of renderList) {
      if (!renderedList.has(c)) {
        c.update()
      }
    }
    renderList.length = 0
    renderedList.clear()

    time('🐇Inserts')
    for (const inserted of this.insertsStack) {
      applyInserts(inserted)
    }
    this.insertsStack.clear()
    timeEnd('🐇Inserts')

    time('🐇Mount/Update')
    for (const cRef of this.didMountStack.values()) {
      const c = cRef.deref()
      if (c) c.componentDidMount()
    }
    this.didMountStack.clear()

    for (const cRef of this.didUpdateStack.values()) {
      const c = cRef.deref()
      if (c) c.componentDidUpdate()
    }
    this.didUpdateStack.clear()
    timeEnd('🐇Mount/Update')

    // console.log(Order.inserted, Order.removed, Order.inserted / Order.removed)
    // logUses()
    // DomMetaPool.finishFrame()

    this.queued = false
  }
}
