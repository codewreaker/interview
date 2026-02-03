import { describe, expect, test, beforeEach, mock } from "bun:test";
import {
  createCounter,
  createRateLimiter,
  memoize,
  createPrivateStore,
  once
} from "../src/closures";

describe("Closures ", () => {
  describe("createCounter", () => {
    test("should start at 0 by default", () => {
      const counter = createCounter();
      expect(counter.getValue()).toBe(0);
    });

    test("should start at initial value", () => {
      const counter = createCounter(10);
      expect(counter.getValue()).toBe(10);
    });

    test("should increment correctly", () => {
      const counter = createCounter(5);
      expect(counter.increment()).toBe(6);
      expect(counter.getValue()).toBe(6);
    });

    test("should decrement correctly", () => {
      const counter = createCounter(5);
      expect(counter.decrement()).toBe(4);
      expect(counter.getValue()).toBe(4);
    });

    test("should reset to initial value", () => {
      const counter = createCounter(10);
      counter.increment();
      counter.increment();
      counter.reset();
      expect(counter.getValue()).toBe(10);
    });

    test("should handle negative values", () => {
      const counter = createCounter(0);
      counter.decrement();
      expect(counter.getValue()).toBe(-1);
    });

    test("should maintain separate state for different counters", () => {
      const counter1 = createCounter(0);
      const counter2 = createCounter(100);
      counter1.increment();
      expect(counter1.getValue()).toBe(1);
      expect(counter2.getValue()).toBe(100);
    });
  });

  describe("createRateLimiter", () => {
    test("should allow calls within limit", () => {
      const limiter = createRateLimiter(3, 1000);
      const callback = mock(() => {});
      
      expect(limiter(callback)).toBe(true);
      expect(limiter(callback)).toBe(true);
      expect(limiter(callback)).toBe(true);
      expect(callback).toHaveBeenCalledTimes(3);
    });

    test("should block calls exceeding limit", () => {
      const limiter = createRateLimiter(2, 1000);
      const callback = mock(() => {});
      
      limiter(callback);
      limiter(callback);
      expect(limiter(callback)).toBe(false);
      expect(callback).toHaveBeenCalledTimes(2);
    });

    test("should reset call history", () => {
      const limiter = createRateLimiter(1, 1000);
      const callback = mock(() => {});
      
      limiter(callback);
      expect(limiter(callback)).toBe(false);
      limiter.reset();
      expect(limiter(callback)).toBe(true);
    });
  });

  describe("memoize", () => {
    test("should cache results", () => {
      let callCount = 0;
      const fn = (n: number) => {
        callCount++;
        return n * 2;
      };
      const memoized = memoize(fn);
      
      expect(memoized(5)).toBe(10);
      expect(memoized(5)).toBe(10);
      expect(callCount).toBe(1);
    });

    test("should compute for different arguments", () => {
      let callCount = 0;
      const fn = (n: number) => {
        callCount++;
        return n * 2;
      };
      const memoized = memoize(fn);
      
      memoized(5);
      memoized(10);
      expect(callCount).toBe(2);
    });

    test("should handle multiple arguments", () => {
      const fn = (a: number, b: number) => a + b;
      const memoized = memoize(fn);
      
      expect(memoized(1, 2)).toBe(3);
      expect(memoized(1, 2)).toBe(3);
      expect(memoized(2, 1)).toBe(3);
    });

    test("should use custom key generator", () => {
      let callCount = 0;
      const fn = (obj: { id: number }) => {
        callCount++;
        return obj.id * 2;
      };
      const memoized = memoize(fn, (obj) => String(obj.id));
      
      memoized({ id: 5 });
      memoized({ id: 5 });
      expect(callCount).toBe(1);
    });

    test("should clear cache", () => {
      let callCount = 0;
      const fn = (n: number) => {
        callCount++;
        return n * 2;
      };
      const memoized = memoize(fn);
      
      memoized(5);
      memoized.clearCache();
      memoized(5);
      expect(callCount).toBe(2);
    });
  });

  describe("createPrivateStore", () => {
    test("should set and get values", () => {
      const store = createPrivateStore<number>();
      const key = {};
      
      store.set(key, 42);
      expect(store.get(key)).toBe(42);
    });

    test("should return undefined for missing keys", () => {
      const store = createPrivateStore<number>();
      const key = {};
      
      expect(store.get(key)).toBeUndefined();
    });

    test("should check if key exists", () => {
      const store = createPrivateStore<number>();
      const key = {};
      
      expect(store.has(key)).toBe(false);
      store.set(key, 42);
      expect(store.has(key)).toBe(true);
    });

    test("should delete keys", () => {
      const store = createPrivateStore<number>();
      const key = {};
      
      store.set(key, 42);
      expect(store.delete(key)).toBe(true);
      expect(store.has(key)).toBe(false);
    });

    test("should return false when deleting non-existent key", () => {
      const store = createPrivateStore<number>();
      const key = {};
      
      expect(store.delete(key)).toBe(false);
    });

    test("should handle different object keys separately", () => {
      const store = createPrivateStore<number>();
      const key1 = {};
      const key2 = {};
      
      store.set(key1, 1);
      store.set(key2, 2);
      expect(store.get(key1)).toBe(1);
      expect(store.get(key2)).toBe(2);
    });
  });

  describe("once", () => {
    test("should only execute function once", () => {
      let callCount = 0;
      const fn = () => {
        callCount++;
        return "result";
      };
      const onceFn = once(fn);
      
      onceFn();
      onceFn();
      onceFn();
      expect(callCount).toBe(1);
    });

    test("should return same result on subsequent calls", () => {
      const fn = () => Date.now();
      const onceFn = once(fn);
      
      const result1 = onceFn();
      const result2 = onceFn();
      expect(result1).toBe(result2);
    });

    test("should pass arguments on first call", () => {
      const fn = (a: number, b: number) => a + b;
      const onceFn = once(fn);
      
      expect(onceFn(1, 2)).toBe(3);
      expect(onceFn(10, 20)).toBe(3); // Still returns first result
    });

    test("should work with functions that return undefined", () => {
      let callCount = 0;
      const fn = () => {
        callCount++;
        return undefined;
      };
      const onceFn = once(fn);
      
      onceFn();
      onceFn();
      expect(callCount).toBe(1);
    });
  });
});
