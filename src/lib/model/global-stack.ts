import {RefObject} from '../components/ref'
import {CTComponent} from '../components/custom-component'

export class GlobalStack {
  private static componentRefs: RefObject<CTComponent>[] = []
  private static dirtyComponents = new Set<RefObject<CTComponent>>()

  static push(componentRef: RefObject<CTComponent>) {
    this.componentRefs.push(componentRef)
  }

  static pop() {
    this.componentRefs.pop()
  }

  static getCurrent(): RefObject<CTComponent> | null {
    return this.componentRefs[this.componentRefs.length - 1] ?? null
  }

  static markDirty(componentRef: RefObject<CTComponent>) {
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
  static renderedList = new Set<CTComponent>()

  private static renderList: CTComponent[] = []

  private static reRender = () => {
    console.time('reRender')
    const {renderList, renderedList} = this

    for (const c of this.dirtyComponents.values()) {
      if (c.current) {
        renderList.push(c.current)
      }
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
