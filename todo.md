# TODO

- ~~Create tests for creating and removing elements. Fix bugs where elements are created and not all removed~~
- ~~Test object pooling performance~~
- ~~Copy across meta properties and don't store the object. Try object pooling for Meta types~~
  - ~~Try not hold onto children after render for all components? Make meta objects go away as soon as `Render.component` has run~~
- Unhandled cases with fragments
- Make internal fields and methods on Custom (component) less visible
- Tidy up types (JSX types came from React and have lots of unneeded stuff)
- ~~Support function components?~~
- ~~If a component has children it must rerender. Check if it has children before comparing props~~