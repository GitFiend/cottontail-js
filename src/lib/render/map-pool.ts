// In testing this seems to be 5-10% faster than making a new Map when run a lot
// The goal is to reduce garbage collection while the user is doing something like
// scrolling a list that is rendering every frame.
// I'm assuming keeping the type consistent is important, so it's enforced.
export class MapPool<K, V> {
  maps: Map<K, V>[] = []

  returnMap(map: Map<K, V>) {
    map.clear()
    this.maps.push(map)
  }

  newMap(): Map<K, V> {
    const m = this.maps.pop()

    if (m) {
      return m
    }
    return new Map<K, V>()
  }
}
