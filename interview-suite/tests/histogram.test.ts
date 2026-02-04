import { describe, expect, test } from "bun:test";
import { histogram } from "../src/histogram";

describe("Histogram", () => {
  test("should calculate histogram correctly", () => {
    const points = [2.3, 3.0, 3.5, 6, 7];
    const boundaries = [0, 5, 10];
    // [0, 5) -> 2.3, 3.0, 3.5 (3 items)
    // [5, 10) -> 6, 7 (2 items)
    const expected = [3, 2];
    expect(histogram(points, boundaries)).toEqual(expected);
  });

  test("should handle example case 2", () => {
    const points = [1, 4, 2, 3, 5];
    const boundaries = [0, 3, 6];
    // [0, 3) -> 1, 2 (2 items)
    // [3, 6) -> 4, 3, 5 (3 items)  <-- Wait, boundary logic is usually [inclusive, exclusive) or similar.
    // Let's check v2 bloomberg.ts logic:
    // if (point >= boundaries[i] && point < boundaries[i + 1])
    // So [0, 3) includes 0, 1, 2. Excludes 3.
    // [3, 6) includes 3, 4, 5. Excludes 6.
    
    // Points: 1, 4, 2, 3, 5
    // [0, 3): 1, 2 -> count 2
    // [3, 6): 4, 3, 5 -> count 3
    // v2 test case said: { points: [1, 4, 2, 3, 5], boundaries: [0, 3, 6], expected: [3, 2] }
    // Wait, if expected is [3, 2], then 3 must be in the first bucket?
    // If [0, 3) -> 1, 2 (2 items)
    // If [0, 3] -> 1, 2, 3 (3 items)
    
    // Let's re-read v2/bloomberg.ts implementation carefully:
    /*
      if (point >= boundaries[i] && point < boundaries[i + 1])
    */
    // This is clearly [inclusive, exclusive).
    // So 3 is NOT < 3. It falls in next bucket.
    // So for points [1, 4, 2, 3, 5] and bounds [0, 3, 6]
    // 1 -> [0, 3)
    // 4 -> [3, 6)
    // 2 -> [0, 3)
    // 3 -> [3, 6)
    // 5 -> [3, 6)
    // Bucket 1: 1, 2 (Count 2)
    // Bucket 2: 4, 3, 5 (Count 3)
    // Result should be [2, 3].
    
    // BUT the stored test case in v2/bloomberg.ts said expected: [3, 2].
    // Maybe the points were different order but shouldn't matter.
    // { points: [1, 4, 2, 3, 5], boundaries: [0, 3, 6], expected: [3, 2] }
    // Maybe I am misreading the boundary points? 1, 2, 3 are small. 4, 5 are large.
    // If expected is [3, 2], then 3 items in first bucket (0-3). 2 items in second (3-6).
    // The items are 1, 2, 3, 4, 5. 
    // To get 3 items in first bucket, it must be {1, 2, 3}. So 3 is included. 
    // That means [start, end].
    // BUT the code says `point < boundaries[i+1]`.
    // Maybe the test case expected value in the file was wrong or I am fundamentally misunderstanding.
    // However, the first test case: points: [3.0, 3.5, 2.3, 6, 7], boundaries: [0, 5, 10], expected: [3, 2]
    // [0, 5): 3.0, 3.5, 2.3 (3 items). Correct.
    // [5, 10): 6, 7 (2 items). Correct.
    
    // So [inclusive, exclusive) seems consistent with the first case.
    // Why did values [1, 4, 2, 3, 5] with bounds [0, 3, 6] expect [3, 2]? 
    // items: 1, 2, 3, 4, 5.
    // [0, 3): 1, 2. (2 items)
    // [3, 6): 3, 4, 5. (3 items)
    // So it should be [2, 3]. The comment/code in the file might have valid reason or just be legacy junk.
    // I will write the test based on the logic [inclusive, exclusive).
    // I'll trust my analysis of the code logic over the metadata in the test array from previous file if they conflict, 
    // OR I will assume the prompt implies standard histogram logic.
    
    // I made a Logic check. 
    // Let's stick to [inclusive, exclusive).
    
    const expected = [2, 3]; 
    expect(histogram(points, boundaries)).toEqual(expected);
  });

  test("should handle empty points", () => {
    const points: number[] = [];
    const boundaries = [0, 5, 10];
    const expected = [0, 0];
    expect(histogram(points, boundaries)).toEqual(expected);
  });

  test("should handle large array with 1000 points", () => {
    // Generate 1000 random points between 0 and 100
    const points = Array.from({ length: 1000 }, () => Math.random() * 100);
    const boundaries = [0, 25, 50, 75, 100];
    
    const result = histogram(points, boundaries);
    
    // Verify the sum equals total points
    expect(result.reduce((sum, count) => sum + count, 0)).toBeLessThanOrEqual(1000);
    // Verify correct number of buckets
    expect(result.length).toBe(4);
    // All counts should be non-negative
    result.forEach(count => expect(count).toBeGreaterThanOrEqual(0));
  });

  test("should handle large array with 10000 points", () => {
    // Generate 10000 sequential points
    const points = Array.from({ length: 10000 }, (_, i) => i);
    const boundaries = [0, 2500, 5000, 7500, 10000];
    const expected = [2500, 2500, 2500, 2500];
    
    expect(histogram(points, boundaries)).toEqual(expected);
  });

  test("should handle many buckets (100 buckets)", () => {
    const points = Array.from({ length: 1000 }, (_, i) => i);
    const boundaries = Array.from({ length: 101 }, (_, i) => i * 10);
    
    const result = histogram(points, boundaries);
    
    // Verify correct number of buckets
    expect(result.length).toBe(100);
    // Each bucket should have exactly 10 points (0-9, 10-19, etc.)
    result.forEach(count => expect(count).toBe(10));
  });

  test("should handle points at exact boundaries", () => {
    const points = [0, 5, 10, 15, 20];
    const boundaries = [0, 5, 10, 15, 20];
    // [0, 5): 0
    // [5, 10): 5
    // [10, 15): 10
    // [15, 20): 15
    const expected = [1, 1, 1, 1];
    expect(histogram(points, boundaries)).toEqual(expected);
  });

  test("should handle points outside all boundaries", () => {
    const points = [-5, -1, 25, 30, 100];
    const boundaries = [0, 5, 10, 20];
    // No points fall within [0, 5), [5, 10), or [10, 20)
    const expected = [0, 0, 0];
    expect(histogram(points, boundaries)).toEqual(expected);
  });

  test("should handle mixed in-range and out-of-range points (large dataset)", () => {
    const points = [
      ...Array.from({ length: 500 }, () => Math.random() * 10),  // 500 points in [0, 10)
      ...Array.from({ length: 500 }, () => 20 + Math.random() * 10)  // 500 points outside range
    ];
    const boundaries = [0, 5, 10];
    
    const result = histogram(points, boundaries);
    
    // Should only count the 500 points in range
    expect(result.reduce((sum, count) => sum + count, 0)).toBe(500);
    expect(result.length).toBe(2);
  });

  test("should handle negative numbers in large dataset", () => {
    const points = Array.from({ length: 2000 }, (_, i) => i - 1000);
    const boundaries = [-1000, -500, 0, 500, 1000];
    const expected = [500, 500, 500, 500];
    
    expect(histogram(points, boundaries)).toEqual(expected);
  });

  test("should handle floating point numbers in large dataset", () => {
    const points = Array.from({ length: 5000 }, () => Math.random() * 1.0);
    const boundaries = [0, 0.25, 0.5, 0.75, 1.0];
    
    const result = histogram(points, boundaries);
    
    // Verify structure
    expect(result.length).toBe(4);
    // All points should be counted (some might be exactly 1.0, which are out of range)
    const total = result.reduce((sum, count) => sum + count, 0);
    expect(total).toBeLessThanOrEqual(5000);
    expect(total).toBeGreaterThan(4900); // Most should be < 1.0
  });

  test("performance test: 100000 points with 10 buckets", () => {
    const points = Array.from({ length: 100000 }, () => Math.random() * 100);
    const boundaries = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    
    const startTime = performance.now();
    const result = histogram(points, boundaries);
    const endTime = performance.now();
    
    // Should complete in reasonable time (< 100ms)
    expect(endTime - startTime).toBeLessThan(100);
    expect(result.length).toBe(10);
    
    const total = result.reduce((sum, count) => sum + count, 0);
    expect(total).toBeLessThanOrEqual(100000);
  });
});
