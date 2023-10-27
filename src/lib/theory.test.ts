describe('benchmark to get a sense of how fast it will be to compare lots of objects per frame', () => {
  test('lots of object creations and comparisons', () => {
    const numComparisons = 2000
    const objects1 = []
    const objects2 = []

    for (let i = 0; i < numComparisons; i++) {
      const o1 = makeTestObject()
      objects1.push(o1)

      if (i % 2 === 0) {
        objects2.push({...o1})
      } else {
        objects2.push(makeTestObject())
      }
    }

    const start = Date.now()

    const equal: boolean[] = []

    for (let i = 0; i < objects1.length; i++) {
      const o1 = objects1[i]
      const o2 = objects2[i]

      // We do object spread to simulate selecting state and putting it into new object
      equal.push(equalValues(o1, {...o2}))
      // equal.push(equalValues(o1, o2))
    }

    const time = Date.now() - start

    console.log(`${time}ms to compare ${numComparisons} prop objects`)

    expect(equal.length).toBe(objects1.length)
    expect(time).toBeLessThan(100)
  })

  test('class as state holder', () => {
    class A {
      a = 5
      b = 3
      c = 'asdf'
    }

    const a = new A()

    expect(Object.keys(a)).toEqual(['a', 'b', 'c'])

    const keys: string[] = []
    const values: any[] = []

    for (const key in a) {
      keys.push(key)
      values.push(a[key as keyof A])
    }

    expect(keys).toEqual(['a', 'b', 'c'])
    expect(values).toEqual([5, 3, 'asdf'])
  })
})

function makeTestObject(): Record<string, unknown> {
  const keys = [
    'a',
    'b',
    'cccc',
    'dddd',
    'eeeeeeeeeeeeeeeee',
    'f',
    'ggg',
    'hh',
    'iiiiiiii',
    'jj',
  ]
  shuffleArray(keys)

  const values = [
    3,
    'text',
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    {a: 4, b: 3, c: keys},
    'asdf asdfas dfasdf',
    {x: 1, y: 1},
    false,
    true,
    {a: {a: {a: {a: {a: {}, b: 3, c: {a: 2}}}}}},
    1234567,
  ]

  const testObject: Record<string, unknown> = {}

  while (keys.length > 0) {
    const key = keys.pop()!
    testObject[key] = values.pop()!
  }

  return testObject
}

// Assumes keys are the same in both objects
function equalValues2(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  for (const key of Object.keys(a)) {
    if (a[key] !== b[key]) return false
  }

  return true
}

// Assumes keys are the same in both objects
function equalValues(a: Record<string, unknown>, b: Record<string, unknown>): boolean {
  for (const key in a) {
    if (a[key] !== b[key]) return false
  }

  return true
}

function shuffleArray(array: unknown[]): void {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
}
