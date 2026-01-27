import { describe, expect, test } from "bun:test";
import { mergeIntervals, Interval } from "../src/merge-intervals";

describe("Merge Intervals", () => {
  test("should merge overlapping intervals", () => {
    const intervals: Interval[] = [[1, 3], [2, 6], [8, 10], [15, 18]];
    const expected: Interval[] = [[1, 6], [8, 10], [15, 18]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should handle empty array", () => {
    const intervals: Interval[] = [];
    const expected: Interval[] = [];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should handle single interval", () => {
    const intervals: Interval[] = [[5, 10]];
    const expected: Interval[] = [[5, 10]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should handle unsorted intervals", () => {
    const intervals: Interval[] = [[8, 10], [1, 3], [15, 18], [2, 6]];
    const expected: Interval[] = [[1, 6], [8, 10], [15, 18]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should merge multiple overlapping intervals into one", () => {
    const intervals: Interval[] = [[1, 4], [2, 5], [3, 6], [5, 8]];
    const expected: Interval[] = [[1, 8]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should handle fully contained intervals", () => {
    const intervals: Interval[] = [[1, 10], [2, 5], [3, 7]];
    const expected: Interval[] = [[1, 10]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should handle adjacent but non-overlapping intervals", () => {
    // [1, 3] and [4, 6] do NOT overlap since 4 > 3
    const intervals: Interval[] = [[1, 3], [4, 6], [7, 9]];
    const expected: Interval[] = [[1, 3], [4, 6], [7, 9]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should handle touching intervals (end equals start)", () => {
    // [1, 3] and [3, 6] overlap since 3 <= 3
    const intervals: Interval[] = [[1, 3], [3, 6], [6, 9]];
    const expected: Interval[] = [[1, 9]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should handle duplicate intervals", () => {
    const intervals: Interval[] = [[1, 5], [1, 5], [1, 5]];
    const expected: Interval[] = [[1, 5]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should not mutate the original array", () => {
    const intervals: Interval[] = [[1, 3], [2, 6]];
    const originalCopy: Interval[] = [[1, 3], [2, 6]];
    mergeIntervals(intervals);
    expect(intervals).toEqual(originalCopy);
  });

  test("should handle large gap between intervals", () => {
    const intervals: Interval[] = [[1, 2], [100, 200], [1000, 2000]];
    const expected: Interval[] = [[1, 2], [100, 200], [1000, 2000]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });

  test("should handle all intervals overlapping into one", () => {
    const intervals: Interval[] = [[1, 100], [2, 50], [25, 75], [50, 90]];
    const expected: Interval[] = [[1, 100]];
    expect(mergeIntervals(intervals)).toEqual(expected);
  });
});
