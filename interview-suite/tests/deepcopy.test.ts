import { describe, expect, test } from "bun:test";
import { deepcopy } from "../src/deepcopy";

describe("Deep Copy", () => {
  test("should copy primitives", () => {
    expect(deepcopy(42)).toBe(42);
    expect(deepcopy("hello")).toBe("hello");
    expect(deepcopy(true)).toBe(true);
    expect(deepcopy(null)).toBe(null);
    expect(deepcopy(undefined)).toBe(undefined);
  });

  test("should deep copy arrays", () => {
    const arr = [1, [2, 3]];
    const copy = deepcopy(arr);
    
    expect(copy).toEqual(arr);
    expect(copy).not.toBe(arr);
    // @ts-ignore
    expect(copy[1]).not.toBe(arr[1]);
  });

  test("should deep copy objects", () => {
    const obj = { a: 1, b: { c: 2 } };
    const copy = deepcopy(obj);
    
    expect(copy).toEqual(obj);
    expect(copy).not.toBe(obj);
    // @ts-ignore
    expect(copy.b).not.toBe(obj.b);
  });
  
  test("should handle mixed nested structures", () => {
      const mixed = {
          a: [1, 2, { b: 3}],
          c: { d: [4, 5]}
      };
      const copy = deepcopy(mixed);
      expect(copy).toEqual(mixed);
      expect(copy).not.toBe(mixed);
      // @ts-ignore
      expect(copy.a[2]).not.toBe(mixed.a[2]);
      // @ts-ignore
      expect(copy.c.d).not.toBe(mixed.c.d);
  });
});
