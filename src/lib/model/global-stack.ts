import {$Component} from '../components/custom-component'
import {Reaction} from './reactions'
import {MetaKind} from '../create-element'

export class GlobalStack {
  private static componentRefs: WeakRef<$Component | Reaction>[] = []
  private static dirtyComponents = new Set<WeakRef<$Component | Reaction>>()

  static push(componentRef: WeakRef<$Component | Reaction>) {
    this.componentRefs.push(componentRef)
  }

  static pop() {
    this.componentRefs.pop()
  }

  static getCurrent(): WeakRef<$Component | Reaction> | null {
    return this.componentRefs[this.componentRefs.length - 1] ?? null
  }

  static markDirty(componentRef: WeakRef<$Component | Reaction>) {
    this.dirtyComponents.add(componentRef)

    this.queueRender()
  }

  private static queued = false
  private static queueRender(): void {
    if (this.queued) return

    this.queued = true
    this.renderList.length = 0
    this.renderedList.clear()

    requestAnimationFrame(this.reRender)
  }

  // We track which components have already updated this frame.
  // Components could update due to props changed, or runes.
  // We assume props updates will happen before rune updates.
  // If the component has updated due to props changed, we don't need to rerun
  static renderedList = new Set<$Component>()

  private static readonly renderList: $Component[] = []
  private static readonly reactionList = new Set<Reaction>()

  private static reRender = () => {
    console.time('reRender')
    const {renderList, renderedList, reactionList} = this

    for (const cRef of this.dirtyComponents.values()) {
      const c = cRef.deref()

      if (c) {
        if (c.kind === MetaKind.custom) {
          renderList.push(c)
        } else {
          reactionList.add(c)
        }
      }
    }

    while (reactionList.size > 0) {
      const reaction: Reaction = reactionList.values().next().value
      reactionList.delete(reaction)

      reaction.run()
    }

    // TODO: Check this
    renderList.sort((a, b) => a.order.localeCompare(b.order))

    for (const c of renderList) {
      if (!renderedList.has(c)) c.update()
    }

    this.queued = false
    console.timeEnd('reRender')
  }
}
