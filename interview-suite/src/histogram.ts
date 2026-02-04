/**
 * Interview Question: Data Histogram Analysis (Bloomberg Style)
 *
 * Context:
 * In financial data analysis, we often need to group continuous data points into discrete "buckets"
 * to visualize distributions (a histogram).
 *
 * Objective:
 * Implement a function `histogram(points, boundaries)` that processes a list of numerical `points`
 * and counts how many fall into specific ranges defined by `boundaries`.
 *
 * Parameters:
 * - `points`: An array of numbers (e.g., stock prices, timestamps).
 * - `boundaries`: An array of numbers defining the edges of the buckets.
 *   Example: `[0, 5, 10]` defines two buckets:
 *     1. Bucket 1: [0, 5)  -> Greater than or equal to 0, Less than 5
 *     2. Bucket 2: [5, 10) -> Greater than or equal to 5, Less than 10
 *
 * Requirements:
 * 1. The function returns an array of integer counts.
 * 2. The output array length should be exactly `boundaries.length - 1`.
 * 3. A point `p` falls into bucket `i` if `boundaries[i] <= p < boundaries[i+1]`.
 *
 * Example:
 * points: [2.3, 3.0, 3.5, 6, 7]
 * boundaries: [0, 5, 10]
 *
 * Analysis:
 * - Bucket [0, 5): Contains 2.3, 3.0, 3.5 -> Total: 3
 * - Bucket [5, 10): Contains 6, 7         -> Total: 2
 *
 * Expected Return: [3, 2]
 */

export const histogram = (points: number[], boundaries: number[]): number[] => {
    const len = boundaries.length - 1;
    const results = (new Array(len)).fill(0);
    if (points.length === 0 || boundaries.length === 0) return results;

    for (const p of points) {
        for (let i = 0; i < len; i++) {
            if (p >= boundaries[i] && p < boundaries[i + 1]) {
                results[i]++;
                break;
            }
        }
    }
    return results;
};
