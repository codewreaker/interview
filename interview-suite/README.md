# Interview Coding Challenge

Welcome to your interview! You have 4 tasks to complete in the `src/` directory.

## Tasks

1. **Array Methods** (`src/array-methods.ts`)
   - Implement `myMap`, `myFilter`, and `myReduce` on the Array prototype.
   - These should behave exactly like the native methods.

2. **Deep Copy** (`src/deepcopy.ts`)
   - Implement a function to create a deep copy of a value.
   - Must handle primitives, arrays, and objects (recursively).

3. **Flatten** (`src/flatten.ts`)
   - Implement a function to flatten nested arrays and object values.
   - Arrays should be flattened to a single level.
   - Objects should have their values recursively flattened.

4. **Histogram** (`src/histogram.ts`)
   - Implement a Bloomberg-style histogram function.
   - Given points and boundaries, count points in each bucket.
   - `[inclusive, exclusive)` logic for boundaries.

## Running Tests

To run the tests while you work:

```bash
bun test
```

To run tests for a specific file:

```bash
bun test tests/array-methods.test.ts
```

## Grading

When you are ready to submit:

```bash
bun run grade
```

or

```bash
npm run grade
```

Good luck!
