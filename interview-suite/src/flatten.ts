//@ts-nocheck
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

const isPrimitive = (val: any): boolean => (typeof val !== "object" || val === null);
const isObject = (val: any):boolean => !(isPrimitive(val) || Array.isArray(val))

export const flatten = <T extends any>(value: T[]) => {
  if (isPrimitive(value)) return value;

  if (Array.isArray(value)) {
    return value.reduce((acc, curr) => {
      return acc.concat(flatten(curr))
    }, [])
  }

  const results = {};
  for (const [k, v] of Object.entries(value)) {
    const flattened = flatten(v);
    if (isObject(v)) {
      Object.assign(results, flattened)
    }else{
      results[k] = flattened
    }
  }
  return results;

};
