/**
 * Interview Question: Merge and Sort Intervals
 *
 * Objective:
 * Given an array of intervals where each interval is represented as [startTime, endTime],
 * merge all overlapping intervals and return a sorted array of non-overlapping intervals.
 *
 * Parameters:
 * - `intervals`: A 2D array of numbers where each sub-array contains exactly two elements [start, end].
 *   - Intervals may be provided in any order.
 *   - Duplicates and fully contained intervals are allowed.
 *
 * Requirements:
 * 1. Sort the intervals by their start time.
 * 2. Merge overlapping intervals (two intervals overlap if the start of one is <= the end of previous when sorted).
 * 3. Return a new array of merged, non-overlapping intervals sorted by start time.
 * 4. Do not mutate the original array.
 *
 * Example:
 * Input: [[1, 3], [2, 6], [8, 10], [15, 18]]
 * Output: [[1, 6], [8, 10], [15, 18]]
 *
 * Explanation:
 * - Step 1: Sort intervals by start time (already sorted).
 * - Step 2: Initialize merged list with first interval [1, 3].
 * - Step 3: Compare [2, 6] with last merged [1, 3]. They overlap (2 <= 3), so merge into [1, 6].
 * - Step 4: Compare [8, 10] with last merged [1, 6]. No overlap (8 > 6), append [8, 10].
 * - Step 5: Compare [15, 18] with last merged [8, 10]. No overlap (15 > 10), append [15, 18].
 * - Result: [[1, 6], [8, 10], [15, 18]].
 *
 * Constraints:
 * - 0 <= intervals.length <= 100000
 * - intervals[i].length == 2 for all valid i
 * - 0 <= intervals[i][0] < intervals[i][1] <= 10^9
 */

export type Interval = [number, number];

export const mergeIntervals = (intervals: Interval[]): Interval[] => {
    if(intervals.length === 0) return intervals;
    const sIntervals = structuredClone(intervals).toSorted((a,b)=>(a[0]-b[0]));
    const result = [sIntervals[0]];

    for (let i=1;i<sIntervals.length;i++){
        const curr = sIntervals[i];
        const lastResult = result.at(-1)!;
        if(curr[0] <= lastResult[1]){
            lastResult[1] = Math.max(curr[1], lastResult[1])
        }else{
            result.push(curr);
        }
    }
    return result;

};
