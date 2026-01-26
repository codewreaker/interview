/**
 * Interview Question: Deep Structure Flattener
 *
 * Objective:
 * Data transformation is a frequent task in frontend engineering. We need a utility that takes
 * a potentially deep structure and "flattens" specifically the *arrays* within it, while
 * preserving other object structures.
 *
 * Your task is to implement a `flatten` function with the following behaviors:
 *
 * Requirements:
 * 1. Primitives: Return the value as is.
 * 2. Arrays: Deeply flatten them into a single-level array.
 *    Example: `[1, [2, [3]]]` should become `[1, 2, 3]`.
 * 3. Objects: Traverse the keys and recursively apply the flatten logic to the values.
 *    The object key structure itself should be preserved.
 *    Example: `{ a: [1, [2]], b: 3 }` should become `{ a: [1, 2], b: 3 }`.
 *
 * Constraints:
 * - Attempt to write clean, recursive code.
 * - Handle empty arrays and objects gracefully.
 */

export const flatten = (value: any): any => {
  // TODO: Implement flatten logic
  throw new Error("Function not implemented.");
};
