/**
 * Interview Question: Reverse a Linked List
 * 
 * Objective:
 * Implement a function that reverses a linked list. The function should modify the list in-place
 * and return the new head node.
 * 
 * Requirements:
 * - Reverse the linked list in-place
 * - Return the new head node
 * - Describe your approach and analyze the runtime complexity
 * - Consider edge cases: empty list, single node, multiple nodes
 * 
 * Example:
 * Input: 1 -> 2 -> 3 -> 4 -> 5 -> null
 * Output: 5 -> 4 -> 3 -> 2 -> 1 -> null
 */

export interface ListNode {
  val: number;
  next: ListNode | null;
}

export function reverseLinkedList(head: ListNode | null): ListNode | null {
  // TODO: Implement the solution
  // Approach: Use three pointers (prev, current, next) to reverse the direction of each link
  // Time Complexity: O(n) where n is the number of nodes
  // Space Complexity: O(1) - only using pointers, not extra space
  
  /*
  let prev: ListNode | null = null;
  let current = head;
  
  while (current !== null) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
  */
  
  return null;
}

// Helper function to create a linked list from an array
export function createLinkedList(arr: number[]): ListNode | null {
  if (arr.length === 0) return null;
  const head: ListNode = { val: arr[0], next: null };
  let current = head;
  
  for (let i = 1; i < arr.length; i++) {
    current.next = { val: arr[i], next: null };
    current = current.next;
  }
  
  return head;
}

// Helper function to convert linked list to array (for testing)
export function linkedListToArray(head: ListNode | null): number[] {
  const result: number[] = [];
  let current = head;
  
  while (current !== null) {
    result.push(current.val);
    current = current.next;
  }
  
  return result;
}
