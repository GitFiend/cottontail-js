export interface RefObject<T> {
  current: T | null
}

// Should we use a class instead?
export function createRef<T = HTMLDivElement>(): RefObject<T> {
  return {
    current: null,
  }
}
