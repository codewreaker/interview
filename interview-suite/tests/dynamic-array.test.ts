import { describe, expect, test, beforeEach } from "bun:test";
import { DynamicArray } from "../src/dynamic-array";

describe("Dynamic Array ", () => {
  let arr: DynamicArray<number>;

  beforeEach(() => {
    arr = new DynamicArray<number>(4);
  });

  describe("constructor", () => {
    test("should initialize with default capacity", () => {
      const defaultArr = new DynamicArray<number>();
      expect(defaultArr.capacity).toBe(8);
      expect(defaultArr.length).toBe(0);
    });

    test("should initialize with specified capacity", () => {
      expect(arr.capacity).toBe(4);
      expect(arr.length).toBe(0);
    });

    test("should handle capacity of 1", () => {
      const smallArr = new DynamicArray<number>(1);
      expect(smallArr.capacity).toBe(1);
    });
  });

  describe("push", () => {
    test("should add single item", () => {
      const newLength = arr.push(1);
      expect(newLength).toBe(1);
      expect(arr.length).toBe(1);
      expect(arr.get(0)).toBe(1);
    });

    test("should add multiple items", () => {
      const newLength = arr.push(1, 2, 3);
      expect(newLength).toBe(3);
      expect(arr.toArray()).toEqual([1, 2, 3]);
    });

    test("should resize when capacity exceeded", () => {
      arr.push(1, 2, 3, 4);
      expect(arr.capacity).toBe(4);
      arr.push(5);
      expect(arr.capacity).toBe(8);
      expect(arr.length).toBe(5);
      expect(arr.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    test("should handle multiple resizes", () => {
      for (let i = 0; i < 20; i++) {
        arr.push(i);
      }
      expect(arr.length).toBe(20);
      expect(arr.capacity).toBeGreaterThanOrEqual(20);
    });
  });

  describe("pop", () => {
    test("should remove and return last item", () => {
      arr.push(1, 2, 3);
      expect(arr.pop()).toBe(3);
      expect(arr.length).toBe(2);
    });

    test("should return undefined for empty array", () => {
      expect(arr.pop()).toBeUndefined();
    });

    test("should work correctly after multiple pops", () => {
      arr.push(1, 2, 3);
      arr.pop();
      arr.pop();
      expect(arr.pop()).toBe(1);
      expect(arr.length).toBe(0);
    });
  });

  describe("get", () => {
    test("should return item at valid index", () => {
      arr.push(10, 20, 30);
      expect(arr.get(0)).toBe(10);
      expect(arr.get(1)).toBe(20);
      expect(arr.get(2)).toBe(30);
    });

    test("should return undefined for negative index", () => {
      arr.push(1);
      expect(arr.get(-1)).toBeUndefined();
    });

    test("should return undefined for out of bounds index", () => {
      arr.push(1);
      expect(arr.get(1)).toBeUndefined();
      expect(arr.get(100)).toBeUndefined();
    });
  });

  describe("set", () => {
    test("should set value at valid index", () => {
      arr.push(1, 2, 3);
      expect(arr.set(1, 99)).toBe(true);
      expect(arr.get(1)).toBe(99);
    });

    test("should return false for negative index", () => {
      arr.push(1);
      expect(arr.set(-1, 99)).toBe(false);
    });

    test("should return false for out of bounds index", () => {
      arr.push(1);
      expect(arr.set(1, 99)).toBe(false);
      expect(arr.set(100, 99)).toBe(false);
    });
  });

  describe("insert", () => {
    test("should insert at beginning", () => {
      arr.push(2, 3);
      expect(arr.insert(0, 1)).toBe(true);
      expect(arr.toArray()).toEqual([1, 2, 3]);
    });

    test("should insert in middle", () => {
      arr.push(1, 3);
      expect(arr.insert(1, 2)).toBe(true);
      expect(arr.toArray()).toEqual([1, 2, 3]);
    });

    test("should insert at end", () => {
      arr.push(1, 2);
      expect(arr.insert(2, 3)).toBe(true);
      expect(arr.toArray()).toEqual([1, 2, 3]);
    });

    test("should resize if needed", () => {
      arr.push(1, 2, 3, 4);
      expect(arr.insert(2, 99)).toBe(true);
      expect(arr.capacity).toBe(8);
      expect(arr.length).toBe(5);
    });

    test("should return false for invalid index", () => {
      arr.push(1);
      expect(arr.insert(-1, 99)).toBe(false);
      expect(arr.insert(5, 99)).toBe(false);
    });
  });

  describe("remove", () => {
    test("should remove from beginning", () => {
      arr.push(1, 2, 3);
      expect(arr.remove(0)).toBe(1);
      expect(arr.toArray()).toEqual([2, 3]);
    });

    test("should remove from middle", () => {
      arr.push(1, 2, 3);
      expect(arr.remove(1)).toBe(2);
      expect(arr.toArray()).toEqual([1, 3]);
    });

    test("should remove from end", () => {
      arr.push(1, 2, 3);
      expect(arr.remove(2)).toBe(3);
      expect(arr.toArray()).toEqual([1, 2]);
    });

    test("should return undefined for invalid index", () => {
      arr.push(1);
      expect(arr.remove(-1)).toBeUndefined();
      expect(arr.remove(5)).toBeUndefined();
    });
  });

  describe("toArray", () => {
    test("should return empty array for empty DynamicArray", () => {
      expect(arr.toArray()).toEqual([]);
    });

    test("should return copy of elements", () => {
      arr.push(1, 2, 3);
      const result = arr.toArray();
      expect(result).toEqual([1, 2, 3]);
      
      // Verify it's a copy
      result[0] = 99;
      expect(arr.get(0)).toBe(1);
    });
  });

  describe("integration tests", () => {
    test("should handle mixed operations", () => {
      arr.push(1, 2, 3);
      arr.insert(1, 99);
      arr.remove(0);
      arr.set(0, 100);
      arr.pop();
      
      expect(arr.toArray()).toEqual([100, 2]);
    });

    test("should work with string type", () => {
      const strArr = new DynamicArray<string>(2);
      strArr.push("hello", "world");
      strArr.insert(1, "beautiful");
      
      expect(strArr.toArray()).toEqual(["hello", "beautiful", "world"]);
    });

    test("should work with object type", () => {
      const objArr = new DynamicArray<{ id: number }>(2);
      objArr.push({ id: 1 }, { id: 2 });
      
      expect(objArr.get(0)?.id).toBe(1);
    });
  });
});
