import { describe, expect, test } from "bun:test";
import { reverseLinkedList, createLinkedList, linkedListToArray } from "../src/reverse-linked-list";

describe("Reverse Linked List", () => {
  test("should reverse a linked list", () => {
    const head = createLinkedList([1, 2, 3, 4, 5]);
    const reversed = reverseLinkedList(head);
    expect(linkedListToArray(reversed)).toEqual([5, 4, 3, 2, 1]);
  });

  test("should handle single node", () => {
    const head = createLinkedList([1]);
    const reversed = reverseLinkedList(head);
    expect(linkedListToArray(reversed)).toEqual([1]);
  });

  test("should handle two nodes", () => {
    const head = createLinkedList([1, 2]);
    const reversed = reverseLinkedList(head);
    expect(linkedListToArray(reversed)).toEqual([2, 1]);
  });

  test("should handle empty list", () => {
    const reversed = reverseLinkedList(null);
    expect(linkedListToArray(reversed)).toEqual([]);
  });

  test("should handle duplicate values", () => {
    const head = createLinkedList([1, 1, 1]);
    const reversed = reverseLinkedList(head);
    expect(linkedListToArray(reversed)).toEqual([1, 1, 1]);
  });

  test("should handle mixed values", () => {
    const head = createLinkedList([10, -1, 0, 5, 100]);
    const reversed = reverseLinkedList(head);
    expect(linkedListToArray(reversed)).toEqual([100, 5, 0, -1, 10]);
  });

  test("should handle large list", () => {
    const largeList = Array.from({ length: 1000 }, (_, i) => i);
    const head = createLinkedList(largeList);
    const reversed = reverseLinkedList(head);
    expect(linkedListToArray(reversed)).toEqual([...largeList].reverse());
  });
});
