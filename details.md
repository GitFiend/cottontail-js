# Re-rendering

Cottontail will re-render a component only when it needs to, to display it's content correctly:
 - If the containing render function calls it with different props. Props are compared by individual prop value.
 - If it accessed an observable while rendering that has now changed
 - If it has children props and a render function that holds it is called in is called.

