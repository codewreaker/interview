import { describe, expect, test } from "bun:test";
import { isBalanced, getHeight, createTreeFromArray } from "../src/is-balanced-tree";

describe("Balanced Binary Tree", () => {
  test("should return true for empty tree", () => {
    expect(isBalanced(null)).toBe(true);
  });

  test("should return true for single node", () => {
    const tree = createTreeFromArray([1]);
    expect(isBalanced(tree)).toBe(true);
  });

  test("should return true for balanced tree", () => {
    // Tree:     3
    //          / \
    //         9  20
    //           /  \
    //          15   7
    const tree = createTreeFromArray([3, 9, 20, null, null, 15, 7]);
    expect(isBalanced(tree)).toBe(true);
  });

  test("should return false for unbalanced tree", () => {
    // Tree:   1
    //          \
    //           2
    //            \
    //             3
    const tree = createTreeFromArray([1, null, 2, null, 3]);
    expect(isBalanced(tree)).toBe(false);
  });

  test("should return true for perfectly balanced tree", () => {
    // Tree:      1
    //          /   \
    //         2     3
    //        / \   / \
    //       4   5 6   7
    const tree = createTreeFromArray([1, 2, 3, 4, 5, 6, 7]);
    expect(isBalanced(tree)).toBe(true);
  });

  test("should return false for left-heavy tree", () => {
    // Tree:       1
    //            / \
    //           2   3
    //          / \
    //         4   5
    //        /
    //       6
    const tree = createTreeFromArray([1, 2, 3, 4, 5, null, null, 6]);
    expect(isBalanced(tree)).toBe(false);
  });

  test("should handle tree with negative numbers", () => {
    const tree = createTreeFromArray([-1, -2, -3]);
    expect(isBalanced(tree)).toBe(true);
  });

  test("should check height correctly", () => {
    const tree = createTreeFromArray([1, 2, 3, 4, 5, 6, 7]);
    expect(getHeight(tree)).toBe(3);
  });

  test("should handle larger unbalanced tree", () => {
    // Deep left subtree, shallow right subtree
    const tree = createTreeFromArray([1, 2, 3, 4, 5, null, null, 6, 7, null, null, 8]);
    expect(isBalanced(tree)).toBe(false);
  });
});
