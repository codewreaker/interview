/**
 * Interview Question: Balanced Binary Tree
 * 
 * Objective:
 * Write a function to determine if a binary tree is balanced. 
 * A balanced tree is defined as a tree where the depth of the two subtrees of every node 
 * never differs by more than one.
 * 
 * Requirements:
 * - Return true if the tree is balanced, false otherwise
 * - Consider what traversal method would you use and why
 * - Analyze the runtime complexity
 * 
 * Example:
 * Tree: 
 *       3
 *      / \
 *     9  20
 *       /  \
 *      15   7
 * Output: true (balanced)
 * 
 * Unbalanced Tree:
 *       1
 *        \
 *         2
 *          \
 *           3
 * Output: false (unbalanced)
 */

export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function isBalanced(root: TreeNode | null): boolean {
  // TODO: Implement the solution
  // Approach: Use DFS (post-order traversal) to check height and balance condition
  // Time Complexity: O(n) where n is the number of nodes
  // Space Complexity: O(h) where h is the height (recursion stack)
  
  /*
  const checkHeight = (node: TreeNode | null): number => {
    if (node === null) return 0;
    
    const leftHeight = checkHeight(node.left);
    if (leftHeight === -1) return -1;
    
    const rightHeight = checkHeight(node.right);
    if (rightHeight === -1) return -1;
    
    // If the difference is more than 1, not balanced
    if (Math.abs(leftHeight - rightHeight) > 1) {
      return -1;
    }
    
    return Math.max(leftHeight, rightHeight) + 1;
  };
  
  return checkHeight(root) !== -1;
  */
  
  return false;
}

// Helper function to get height of tree
export function getHeight(node: TreeNode | null): number {
  /*
  if (node === null) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  */
  return 0;
}

// Helper function to create a tree from array (level-order)
export function createTreeFromArray(arr: (number | null)[]): TreeNode | null {
  if (arr.length === 0 || arr[0] === null) return null;
  
  const root: TreeNode = { val: arr[0], left: null, right: null };
  const queue: TreeNode[] = [root];
  let i = 1;
  
  while (queue.length > 0 && i < arr.length) {
    const node = queue.shift()!;
    
    if (arr[i] !== null) {
      node.left = { val: arr[i], left: null, right: null };
      queue.push(node.left);
    }
    i++;
    
    if (i < arr.length && arr[i] !== null) {
      node.right = { val: arr[i], left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  
  return root;
}
