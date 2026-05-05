/**
 * Interview Question: Two Sum
 * 
 * Objective:
 * Given an array of integers, write a function to find the two numbers that add up to a specific target.
 * You may assume that each input would have exactly one solution, and you may not use the same element twice.
 * 
 * Requirements:
 * - Return the indices of the two numbers that add up to the target
 * - Consider the time and space complexity of your solution
 * - The returned array should be sorted in ascending order
 * 
 * Example:
 * Input: nums = [2, 7, 11, 15], target = 9
 * Output: [0, 1] (because nums[0] + nums[1] = 2 + 7 = 9)
 * 
 * Constraints:
 * - 2 <= nums.length <= 10^4
 * - -10^9 <= nums[i] <= 10^9
 * - -10^9 <= target <= 10^9
 */

export function twoSum(nums: number[], target: number): number[] {
  // TODO: Implement the solution
  // Approach: Use a hash map to store values we've seen and their indices
  // Time Complexity: O(n)
  // Space Complexity: O(n)
  
  /*
  const seen = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (seen.has(complement)) {
      const j = seen.get(complement)!;
      return [j, i].sort((a, b) => a - b);
    }
    
    seen.set(nums[i], i);
  }
  
  return [];
  */
  
  return [];
}
