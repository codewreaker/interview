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
});
