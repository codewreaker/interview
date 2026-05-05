import { describe, expect, test } from "bun:test";
import { twoSum } from "../src/two-sum";

describe("Two Sum", () => {
  test("should find two numbers that sum to target", () => {
    const result = twoSum([2, 7, 11, 15], 9);
    expect(result).toEqual([0, 1]);
  });

  test("should work with negative numbers", () => {
    const result = twoSum([-1, -2, -3, 5, 10], 7);
    expect(result).toEqual([3, 4]);
  });

  test("should return sorted indices", () => {
    const result = twoSum([3, 2, 4], 6);
    expect(result).toEqual([1, 2]);
  });

  test("should work with large numbers", () => {
    const result = twoSum([1000000, 2000000, -1000000], 1000000);
    expect(result).toEqual([0, 2]);
  });

  test("should work with two elements", () => {
    const result = twoSum([1, 2], 3);
    expect(result).toEqual([0, 1]);
  });

  test("should handle minimum case", () => {
    const result = twoSum([0, 0], 0);
    expect(result).toEqual([0, 1]);
  });
});
