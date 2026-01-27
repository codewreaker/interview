/**
 * Interview Question: Deep Copy Implementation
 *
 * Objective:
 * In JavaScript, objects and arrays are reference types. A common challenge is creating a
 * true "deep copy" of a complex nested structure, ensuring that no references are shared
 * between the original and the new copy.
 *
 * Your task is to implement a robust `deepcopy` function.
 *
 * Requirements:
 * 1. The function should accept any value (primitive, object, array, null, undefined).
 * 2. It must return a completely new independent copy of the input.
 * 3. Modifying the result should NEVER affect the original input.
 * 4. It must recursively handle nested objects and arrays of arbitrary depth.
 *
 * Examples:
 * - Primitives (number, string, boolean) remain unchanged.
 * - `[1, { a: 2 }]` -> A new array containing 1 and a NEW object { a: 2 }.
 *
 * Edge Cases:
 * - Ensure it correctly handles `null` and `undefined`.
 * - You may assume the input is JSON-serializable (no circular references, functions, or Dates) for this version,
 *   unless you wish to challenge yourself further.
 */

const isPrimitive=(val:any)=>((typeof val !== "object") || val === null);

export const deepcopy = <T>(value: T): T | T[] => {
  if(isPrimitive(value)) return value;

  if(Array.isArray(value)){
    return value.map(deepcopy)
  }

  const result:any = {} as T;
  for (const [k,v] of Object.entries(value as any)){
    result[k] = deepcopy(v)
  }

  return result;

};
