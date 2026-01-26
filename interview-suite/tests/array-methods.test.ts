import { describe, expect, test, beforeEach } from "bun:test";
import "../src/array-methods";

describe("Array Methods", () => {
  describe("myMap", () => {
    test("should map values correctly", () => {
      const arr = [1, 2, 3];
      const result = arr.myMap((x) => x * 2);
      expect(result).toEqual([2, 4, 6]);
    });

    test("should pass correct arguments to callback", () => {
      const arr = [10];
      arr.myMap((item, index, array) => {
        expect(item).toBe(10);
        expect(index).toBe(0);
        expect(array).toBe(arr);
        return item;
      });
    });

    test("should not mutate original array", () => {
      const arr = [1, 2, 3];
      arr.myMap((x) => x * 2);
      expect(arr).toEqual([1, 2, 3]);
    });
    
    test("should handle empty arrays", () => {
        const arr: number[] = [];
        const result = arr.myMap(x => x * 2);
        expect(result).toEqual([]);
    });
  });

  describe("myFilter", () => {
    test("should filter values correctly", () => {
      const arr = [1, 2, 3, 4];
      const result = arr.myFilter((x) => x % 2 === 0);
      expect(result).toEqual([2, 4]);
    });

    test("should pass correct arguments to callback", () => {
      const arr = [10];
      arr.myFilter((item, index, array) => {
        expect(item).toBe(10);
        expect(index).toBe(0);
        expect(array).toBe(arr);
        return true;
      });
    });

    test("should not mutate original array", () => {
      const arr = [1, 2, 3];
      arr.myFilter((x) => x > 1);
      expect(arr).toEqual([1, 2, 3]);
    });
    
    test("should handle empty arrays", () => {
        const arr: number[] = [];
        const result = arr.myFilter(x => x > 0);
        expect(result).toEqual([]);
    });
  });

  describe("myReduce", () => {
    test("should reduce values correctly with initial value", () => {
      const arr = [1, 2, 3, 4];
      const result = arr.myReduce((acc, curr) => acc + curr, 0);
      expect(result).toBe(10);
    });

    test("should reduce values correctly without initial value", () => {
      const arr = [1, 2, 3];
      const result = arr.myReduce((acc, curr) => acc + curr);
      expect(result).toBe(6);
    });

    test("should pass correct arguments to callback", () => {
      const arr = [1, 2];
      arr.myReduce((acc, curr, index, array) => {
        if (index === 1) {
            expect(acc).toBe(1);
            expect(curr).toBe(2);
            expect(array).toBe(arr);
        }
        return acc + curr;
      });
    });

    test("should not mutate original array", () => {
      const arr = [1, 2, 3];
      arr.myReduce((acc, curr) => acc + curr, 0);
      expect(arr).toEqual([1, 2, 3]);
    });
    
    test("should handle empty array with initial value", () => {
        const arr: number[] = [];
        const result = arr.myReduce((acc, curr) => acc + curr, 0);
        expect(result).toBe(0);
    });
  });
});
