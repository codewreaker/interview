/**
 * Interview Question: Random Data Structure with O(1) Operations
 * 
 * Objective:
 * Design a data structure that supports the following operations in average O(1) time:
 * 1. insert(val: number): Insert a value (duplicates allowed)
 * 2. remove(val: number): Remove a value
 * 3. getRandom(): Return a random element from the data structure
 * 
 * Requirements:
 * - All operations should run in O(1) average time
 * - getRandom() should return each element with equal probability
 * - Consider what edge cases you need to handle
 * 
 * Approach Discussion:
 * - What data structures would you use and why?
 * - How would you handle duplicates?
 * - What trade-offs might you need to make?
 */

export class RandomizedSet {
  // TODO: Implement the solution
  
  constructor() {
    // Initialize your data structures here
  }
  
  // TODO: Insert a value
  insert(val: number): boolean {
    /*
    // Check if value already exists
    if (this.valToIndex.has(val)) {
      return false;
    }
    
    // Add to array and map
    this.nums.push(val);
    this.valToIndex.set(val, this.nums.length - 1);
    return true;
    */
    return false;
  }
  
  // TODO: Remove a value
  remove(val: number): boolean {
    /*
    if (!this.valToIndex.has(val)) {
      return false;
    }
    
    const index = this.valToIndex.get(val)!;
    const lastNum = this.nums[this.nums.length - 1];
    
    // Move last element to the position of removed element
    this.nums[index] = lastNum;
    this.valToIndex.set(lastNum, index);
    
    // Remove last element
    this.nums.pop();
    this.valToIndex.delete(val);
    
    return true;
    */
    return false;
  }
  
  // TODO: Get random element
  getRandom(): number {
    /*
    const randomIndex = Math.floor(Math.random() * this.nums.length);
    return this.nums[randomIndex];
    */
    return -1;
  }
}

/*
// Solution approach using Map and Array
// Time Complexity: O(1) average for all operations
// Space Complexity: O(n) where n is the number of elements

class Solution {
  private nums: number[] = [];
  private valToIndex: Map<number, number> = new Map();
  
  insert(val: number): boolean {
    if (this.valToIndex.has(val)) {
      return false;
    }
    this.nums.push(val);
    this.valToIndex.set(val, this.nums.length - 1);
    return true;
  }
  
  remove(val: number): boolean {
    if (!this.valToIndex.has(val)) {
      return false;
    }
    const index = this.valToIndex.get(val)!;
    const lastNum = this.nums[this.nums.length - 1];
    this.nums[index] = lastNum;
    this.valToIndex.set(lastNum, index);
    this.nums.pop();
    this.valToIndex.delete(val);
    return true;
  }
  
  getRandom(): number {
    const randomIndex = Math.floor(Math.random() * this.nums.length);
    return this.nums[randomIndex];
  }
}
*/
