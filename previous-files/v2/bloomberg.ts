/**
 * Bloomberg Histogram Problem:
 * Given a set of points and boundaries, return the count of points that fall within each boundary range.
 *
 * Example:
 * boundary([2.3, 3.0, 3.5, 6, 7], [0, 5, 10]) -> [3, 2]
 */

const histogram2 = (points: number[], boundaries: number[]) => {
  //@ts-ignore
  const sortedPoints = points.toSorted((a, b) => a - b);
  const len = boundaries.length - 1;
  const arr = new Array(len).fill(0);

  for (const point of sortedPoints) {
    for (let i = 0; i < len; i++) {
      if (point >= boundaries[i] && point < boundaries[i + 1]) {
        arr[i]++;
      }
    }
  }
  return arr;
};

function histogram(points: number[], boundaries: number[]): number[] {
    const result: number[] = new Array(boundaries.length - 1).fill(0);
    for (const point of points) {
        for (let i = 0; i < boundaries.length - 1; i++) {
            if (point >= boundaries[i] && point < boundaries[i + 1]) {
                result[i]++;
                break;
            }
        }
    }
    return result;
}

// Test cases
const testCases: {
  points: number[];
  boundaries: number[];
  expected: number[];
}[] = [
  { points: [3.0, 3.5, 2.3, 6, 7], boundaries: [0, 5, 10], expected: [3, 2] },
  { points: [1, 4, 2, 3, 5], boundaries: [0, 3, 6], expected: [3, 2] },
  { points: [20, 10, 30], boundaries: [0, 15, 25, 35], expected: [1, 1, 1] },
  { points: [0, 5, 10], boundaries: [0, 5, 10], expected: [1, 2] },
  { points: [], boundaries: [0, 5, 10], expected: [0, 0] },
];

// testCases.forEach(({ points, boundaries, expected }, index) => {
//   console.error("===========NEW TEST CASE===========");
//   const result = histogram(points, boundaries);
//   const passed = JSON.stringify(result) === JSON.stringify(expected);
//   passed && console.log(`Test case ${index + 1}:Passed`);
//   !passed &&
//     console.error(
//       `Failed (Expected ${JSON.stringify(expected)}, got ${JSON.stringify(
//         result
//       )})`
//     );
// });

testCases.forEach(({ points, boundaries, expected }, index) => {
    console.error("===========NEW TEST CASE-2===========");
    const result = histogram2(points, boundaries);
    const passed = JSON.stringify(result) === JSON.stringify(expected);
    passed && console.log(`Test case ${index + 1}:Passed`);
    !passed &&
      console.error(
        `Failed (Expected ${JSON.stringify(expected)}, got ${JSON.stringify(
          result
        )})`
      );
  });
