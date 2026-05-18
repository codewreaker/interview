import { describe, expect, test } from "bun:test";
import { RandomizedSet } from "../src/random-data-structure";

describe("Randomized Set with O(1) Operations", () => {
  test("should insert and get random value", () => {
    const set = new RandomizedSet();
    expect(set.insert(1)).toBe(true);
    expect(set.getRandom()).toBe(1);
  });

  test("should not insert duplicate", () => {
    const set = new RandomizedSet();
    expect(set.insert(1)).toBe(true);
    expect(set.insert(1)).toBe(false);
  });

  test("should remove value", () => {
    const set = new RandomizedSet();
    set.insert(1);
    expect(set.remove(1)).toBe(true);
    expect(set.remove(1)).toBe(false);
  });

  test("should handle multiple insertions and removals", () => {
    const set = new RandomizedSet();
    expect(set.insert(1)).toBe(true);
    expect(set.insert(2)).toBe(true);
    expect(set.insert(3)).toBe(true);
    expect(set.remove(2)).toBe(true);
    expect(set.getRandom()).toBeOneOf([1, 3]);
    expect(set.insert(2)).toBe(true);
  });

  test("should return correct random distribution", () => {
    const set = new RandomizedSet();
    set.insert(1);
    set.insert(2);
    set.insert(3);
    
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    for (let i = 0; i < 300; i++) {
      const val = set.getRandom();
      counts[val as keyof typeof counts]++;
    }
    
    // Each should appear roughly equally (within reasonable bounds for randomness)
    expect(counts[1]).toBeGreaterThan(50);
    expect(counts[2]).toBeGreaterThan(50);
    expect(counts[3]).toBeGreaterThan(50);
  });

  test("should handle edge case of all removals", () => {
    const set = new RandomizedSet();
    set.insert(1);
    set.insert(2);
    set.remove(1);
    set.remove(2);
    expect(set.remove(1)).toBe(false);
  });

  test("should maintain consistency after operations", () => {
    const set = new RandomizedSet();
    set.insert(1);
    set.insert(2);
    set.remove(1);
    set.insert(3);
    
    expect(set.getRandom()).toBeOneOf([2, 3]);
  });
});
