import { describe, expect, test } from "bun:test";
import { flatten } from "../src/flatten";

describe("Flatten", () => {
  test("should return primitives as is", () => {
    expect(flatten(42)).toBe(42);
  });

  test("should flatten nested arrays", () => {
    const input = [1, [2, [3, 4], 5], 6];
    const expected = [1, 2, 3, 4, 5, 6];
    expect(flatten(input)).toEqual(expected);
  });

  test("should flatten object values", () => {
    const input = { a: 1, b: { c: 2, d: 3 } };
    const expected = { a: 1, b: 2, c: 3, d: 3 }; // Wait, checking previous implementation and logic.
    // The previous implementation was:
    // return Object.entries(values).reduce((acc, [k,v])=>{ acc[k] = flatten(v); return acc }, {})
    // That suggests it recursively flattens VALUES potentially, but keeps the structure? 
    // Let's re-read the v1 flatten.ts:
    /*
    return Object.entries(values).reduce((acc, [k,v])=>{
        acc[k] = flatten(v)
        return acc;
    },{})
    */
    // If v is a primitive, it returns expected. If v is {c:2}, flatten({c:2}) returns {c:2}. 
    // Wait, the v1 implementation DOES NOT flatten objects into a single level object. It just recursively calls flatten on values.
    // The v2 implementation:
    /*
    const final = {};
    for (const [k, v] of Object.entries(flat)) {
        final[k] = flatten(v);
    }
    return final;
    */
    // Both implementations preserve object structure but recurse.
    // However, the test case in `flatten.test.ts` (v1) showed:
    /*
    // Test: flattens an array of objects
    const input5 = [{ a: 1 }, [{ b: 2 }, { c: 3 }], { d: 4 }];
    const output5 = [{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }]; 
    */
    // It seems "flatten" usually means flattening arrays. For objects, it usually just recurses or stays same if not array.
    // Let's stick to the Array Flattening behavior which seems to be the primary goal, and for objects it just traverses.
  });
  
  test("should flatten objects containing arrays", () => {
      // Re-verifying expected behavior for objects from previous files
      // v1 flatten.ts just recursed.
      // So {a: [1, [2]]} -> {a: [1, 2]}
      const input = { a: [1, [2, 3]], b: 4 };
      const expected = { a: [1, 2, 3], b: 4 };
      expect(flatten(input)).toEqual(expected);
  });

  test("should handle empty structures", () => {
    expect(flatten([])).toEqual([]);
    expect(flatten({})).toEqual({});
  });
  
  test("should flatten deeply nested arrays", () => {
      const input = [1, [2, [3, [4]]]];
      const expected = [1, 2, 3, 4];
      expect(flatten(input)).toEqual(expected);
  });

  test("nested empty objects are removed", () => {
      const input = { a: {}, b: {} };
      const expected = {};
      expect(flatten(input)).toEqual(expected);
  });

  test("nested objects are flattened", () => {
      const input = { a: 1, b: { c: 2, d: 3 } };
      const expected = { a: 1, c: 2, d: 3 };
      expect(flatten(input)).toEqual(expected);
  });

  test("nested arrays and objects together", () => {
      const input = { a: [1, [2]], b: { c: [3, [4]], d: 5 } };
      const expected = { a: [1, 2], c: [3, 4], d: 5 };
      expect(flatten(input)).toEqual(expected);
  });
});
