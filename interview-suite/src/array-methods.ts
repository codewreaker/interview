/**
 * Interview Question: Polyfills for Array Methods
 *
 * Objective:
 * JavaScript's built-in Array methods are powerful, but understanding their internal mechanics
 * is crucial for a senior engineer. Your task is to implement your own versions of `map`, `filter`,
 * and `reduce` as prototypes on the Array object.
 *
 * Requirements:
 * 1. Array.prototype.myMap<U>(callback: (item: T, index: number, array: T[]) => U): U[]
 *    - Should return a new array where each element is the result of the callback function.
 *    - The callback receives the current item, index, and the original array.
 *
 * 2. Array.prototype.myFilter(callback: (item: T, index: number, array: T[]) => boolean): T[]
 *    - Should return a new array containing only elements for which the callback returns true.
 *
 * 3. Array.prototype.myReduce<U>(callback: (acc: U, curr: T, index: number, array: T[]) => U, initialValue?: U): U
 *    - Should reduce the array to a single value based on the callback.
 *    - If `initialValue` is provided, it is used as the starting accumulator.
 *    - If `initialValue` is NOT provided, the first element of the array is used as the initial accumulator,
 *      and the iteration starts from the second element.
 *
 * Constraints:
 * - Do not use the native `.map()`, `.filter()`, or `.reduce()` methods in your implementation.
 * - Ensure your implementation handles edge cases like empty arrays correctly.
 * - Avoid mutating the original array.
 */

export { };

declare global {
  interface Array<T> {
    myMap<U>(callback: (item: T, index: number, array: T[]) => U): U[];
    myFilter(callback: (item: T, index: number, array: T[]) => boolean): T[];
    myReduce<U>(callback: (acc: U, curr: T, index: number, array: T[]) => U, initialValue?: U): U;
  }
}

Array.prototype.myMap = function <T, U>(callback: (item: T, index: number, array: T[]) => U): U[] {
  const results = [];
  for (let i = 0; i < this.length; i++) {
    results[i] = callback(this[i], i, this)
  }
  return results;
};

Array.prototype.myFilter = function <T>(callback: (item: T, index: number, array: T[]) => boolean): T[] {
  const results = [];
  for (let i = 0; i < this.length; i++) {
    if (callback(this[i], i, this)) {
      results.push(this[i])
    }
  }
  return results;
};

Array.prototype.myReduce = function <T, U>(callback: (acc: U, curr: T, index: number, array: T[]) => U, initialValue?: U): U {
  let accumulator:U = initialValue ?? this[0];
  const idx = (initialValue === null || initialValue === undefined ) ? 1:0;
  for (let i=idx;i<this.length;i++){
    accumulator = callback(accumulator, this[i], i, this);
  }
  return accumulator;
};
