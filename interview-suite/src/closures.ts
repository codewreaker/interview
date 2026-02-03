/**
 * Interview Question: JavaScript Closures in Practice 
 *
 * Context:
 * Closures are a fundamental JavaScript concept where a function retains access to variables
 * from its lexical scope even after the outer function has returned. Understanding closures
 * is essential for writing clean, encapsulated code and is commonly tested in interviews.
 *
 * Objective:
 * Implement several utility functions that demonstrate practical applications of closures,
 * including state encapsulation, function factories, and memoization.
 *
 * Requirements:
 *
 * 1. createCounter(initialValue?: number): Counter
 *    - Return an object with increment(), decrement(), reset(), and getValue() methods.
 *    - initialValue defaults to 0.
 *    - The internal count should not be directly accessible from outside.
 *
 * 2. createRateLimiter(maxCalls: number, windowMs: number): RateLimiter
 *    - Return a function that limits how many times a callback can be invoked within a time window.
 *    - Returns true if the call was allowed, false if rate limited.
 *    - Include a reset() method to clear the call history.
 *
 * 3. memoize<T extends (...args: any[]) => any>(fn: T, keyGenerator?: (...args: Parameters<T>) => string): T
 *    - Return a memoized version of the function that caches results.
 *    - Optional keyGenerator to create custom cache keys (defaults to JSON.stringify of args).
 *    - The returned function should also have a clearCache() method.
 *
 * 4. createPrivateStore<T>(): PrivateStore<T>
 *    - Create a store that associates private data with object keys using closures.
 *    - Methods: set(key: object, value: T), get(key: object): T | undefined, has(key: object): boolean, delete(key: object): boolean
 *    - Similar to WeakMap but implemented with closures.
 *
 * 5. once<T extends (...args: any[]) => any>(fn: T): T
 *    - Return a function that only executes once, returning the first result for subsequent calls.
 *
 * Examples:
 *
 * // createCounter
 * const counter = createCounter(10);
 * counter.increment();  // internal value: 11
 * counter.getValue();   // 11
 * counter.reset();
 * counter.getValue();   // 10
 *
 * // createRateLimiter
 * const limiter = createRateLimiter(3, 1000);
 * limiter(() => console.log("call 1"));  // true, executes
 * limiter(() => console.log("call 2"));  // true, executes
 * limiter(() => console.log("call 3"));  // true, executes
 * limiter(() => console.log("call 4"));  // false, rate limited
 *
 * // memoize
 * const expensiveFn = (n: number) => { console.log("computing"); return n * 2; };
 * const memoized = memoize(expensiveFn);
 * memoized(5);  // logs "computing", returns 10
 * memoized(5);  // returns 10 (cached, no log)
 *
 * // once
 * const initialize = once(() => { console.log("init"); return Date.now(); });
 * const time1 = initialize();  // logs "init", returns timestamp
 * const time2 = initialize();  // returns same timestamp, no log
 * time1 === time2;  // true
 *
 * Constraints:
 * - Do not use global variables or external state.
 * - All state must be encapsulated within closures.
 * - Memoize should handle functions with multiple arguments.
 */

export interface Counter {
  increment: () => number;
  decrement: () => number;
  reset: () => void;
  getValue: () => number;
}

export interface RateLimiter {
  (callback: () => void): boolean;
  reset: () => void;
}

export interface MemoizedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  clearCache: () => void;
}

export interface PrivateStore<T> {
  set: (key: object, value: T) => void;
  get: (key: object) => T | undefined;
  has: (key: object) => boolean;
  delete: (key: object) => boolean;
}

export const createCounter = (initialValue: number = 0): Counter => {
  let count = initialValue;

  return {
    increment: () => ++count,
    decrement: () => --count,
    reset: () => { count = initialValue; },
    getValue: () => count,
  };
};

export const createRateLimiter = (maxCalls: number, windowMs: number): RateLimiter => {
  let callTimestamps: number[] = [];

  const limiter = ((callback: () => void): boolean => {
    const now = Date.now();
    // Remove timestamps outside the window
    callTimestamps = callTimestamps.filter(ts => now - ts < windowMs);

    if (callTimestamps.length < maxCalls) {
      callTimestamps.push(now);
      callback();
      return true;
    }
    return false;
  }) as RateLimiter;

  limiter.reset = () => {
    callTimestamps = [];
  };

  return limiter;
};

export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string
): MemoizedFunction<T> => {
  const cache = new Map<string, ReturnType<T>>();
  const getKey = keyGenerator ?? ((...args: Parameters<T>) => JSON.stringify(args));

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as MemoizedFunction<T>;

  memoized.clearCache = () => {
    cache.clear();
  };

  return memoized;
};

export const createPrivateStore = <T>(): PrivateStore<T> => {
  const entries: { key: object; value: T }[] = [];

  const findIndex = (key: object): number => {
    return entries.findIndex(entry => entry.key === key);
  };

  return {
    set: (key: object, value: T) => {
      const idx = findIndex(key);
      if (idx !== -1) {
        entries[idx].value = value;
      } else {
        entries.push({ key, value });
      }
    },
    get: (key: object): T | undefined => {
      const idx = findIndex(key);
      return idx !== -1 ? entries[idx].value : undefined;
    },
    has: (key: object): boolean => {
      return findIndex(key) !== -1;
    },
    delete: (key: object): boolean => {
      const idx = findIndex(key);
      if (idx !== -1) {
        entries.splice(idx, 1);
        return true;
      }
      return false;
    },
  };
};

export const once = <T extends (...args: any[]) => any>(fn: T): T => {
  let hasRun = false;
  let result: ReturnType<T>;

  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!hasRun) {
      hasRun = true;
      result = fn(...args);
    }
    return result;
  }) as T;
};
