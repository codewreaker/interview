/**
 * Interview Question: Flatten
 *
 * Write a `flatten` function that takes in a value and returns a flattened version of that value.
 *
 * For the purpose of this problem, a flattened value is defined as follows:
 *
 * Requirements:
 * 1. Primitive values should be left unchanged.
 * 
 * 2. Nested arrays should have their values brought up to the top level array. For example,
 *    `[1, 2, [3, 4, [5, 6]]]` would be flattened to `[1, 2, 3, 4, 5, 6]`.
 * 
 * 3. Nested objects should have their key-value pairs brought to the top level object. For example,
 *    `{a: 1, b: {c: 2, d: 3, e: {f: 4}}}` would be flattened to `{a: 1, c: 2, d: 3, f: 4}`.
 *    Note that this means the keys "b" and "e" were completely removed, since their values were 
 *    flattened to the top level. In the event of a key collision (e.g., if both `{a: 1, b: {a: 2}}`), 
 *    any associated value can be used.
 * 
 * 4. Arrays nested in objects and objects nested in arrays should be flattened. For example,
 *    `{a: [1, 2, [3, 4]]}` would be flattened to `{a: [1, 2, 3, 4]}`, and 
 *    `[{a: 1, b: {c: 2, d: 3}}]` would be flattened to `[{a: 1, c: 2, d: 3}]`.
 *
 * For simplicity, you can assume the value as well as any nested values will not be functions.
 * Additionally, you can assume that all object keys will be strings. Your solution can return a 
 * flattened value in place, or it can return a new value; either is acceptable.
 *
 * Your code should not call the native `Array.prototype.flat()` function.
 *
 * Constraints:
 * - Write clean, recursive code.
 * - Handle empty arrays and objects gracefully.
 */

const isPrimitive = (val: any) => (val === null || typeof val !== "object");
const isTrueObject = (val: any) => (!(isPrimitive(val) || Array.isArray(val)));


export const flatten = (value: any): any => {
    if (isPrimitive(value)) return value;

    if (Array.isArray(value)) {
        return value.reduce((acc, curr) => (acc.concat(flatten(curr))), [])
    }

    const result: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) {
        const flattenedValue = flatten(v);
        if(isTrueObject(flattenedValue)){
            Object.assign(result, flattenedValue);
        }else{
            result[k] = flattenedValue
        }
    }
    return result;
};
