import { describe, expect, test } from "bun:test";
import { debounce } from "../src/debounce";

// Helper function to wait for a specified time
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("Debounce Function", () => {
  describe("basic debounce (trailing edge)", () => {
    test("should not call callback immediately", () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50);

      debounced();
      expect(callCount).toBe(0);
    });

    test("should call callback after delay", async () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50);

      debounced();
      expect(callCount).toBe(0);

      await wait(60);
      expect(callCount).toBe(1);
    });

    test("should only call callback once for multiple rapid calls", async () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50);

      debounced();
      debounced();
      debounced();
      debounced();

      await wait(60);
      expect(callCount).toBe(1);
    });

    test("should reset timer on each call", async () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50);

      debounced();
      await wait(30);
      expect(callCount).toBe(0);

      debounced(); // Reset timer
      await wait(30);
      expect(callCount).toBe(0);

      debounced(); // Reset timer again
      await wait(30);
      expect(callCount).toBe(0);

      await wait(30); // Now 60ms since last call
      expect(callCount).toBe(1);
    });

    test("should call callback with most recent arguments", async () => {
      let receivedArgs: any[] = [];
      const callback = (...args: any[]) => {
        receivedArgs = args;
      };
      const debounced = debounce(callback, 50);

      debounced("first");
      debounced("second");
      debounced("third", "extra");

      await wait(60);
      expect(receivedArgs).toEqual(["third", "extra"]);
    });

    test("should allow multiple separate invocations after delay", async () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50);

      debounced();
      await wait(60);
      expect(callCount).toBe(1);

      debounced();
      await wait(60);
      expect(callCount).toBe(2);

      debounced();
      await wait(60);
      expect(callCount).toBe(3);
    });
  });

  describe("immediate mode (leading edge)", () => {
    test("should call callback immediately on first call", () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50, true);

      debounced();
      expect(callCount).toBe(1);
    });

    test("should not call callback again within delay period", () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50, true);

      debounced(); // Fires immediately
      expect(callCount).toBe(1);

      debounced(); // Ignored
      debounced(); // Ignored
      debounced(); // Ignored

      expect(callCount).toBe(1);
    });

    test("should not fire on trailing edge in immediate mode", async () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50, true);

      debounced(); // Fires immediately
      expect(callCount).toBe(1);

      await wait(60);
      expect(callCount).toBe(1); // Should not have fired again
    });

    test("should allow new immediate call after delay expires", async () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50, true);

      debounced(); // Fires immediately
      expect(callCount).toBe(1);

      await wait(60); // Delay expires

      debounced(); // Should fire immediately again
      expect(callCount).toBe(2);
    });

    test("should reset delay timer on subsequent calls", async () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 50, true);

      debounced(); // Fires immediately
      expect(callCount).toBe(1);

      await wait(30);
      debounced(); // Ignored, but resets timer

      await wait(30);
      debounced(); // Still ignored (only 30ms since last call)
      expect(callCount).toBe(1);

      await wait(60); // Now delay has expired

      debounced(); // Should fire immediately
      expect(callCount).toBe(2);
    });

    test("should call with correct arguments in immediate mode", () => {
      let receivedArgs: any[] = [];
      const callback = (...args: any[]) => {
        receivedArgs = args;
      };
      const debounced = debounce(callback, 50, true);

      debounced("hello", "world");
      expect(receivedArgs).toEqual(["hello", "world"]);
    });
  });

  describe("context preservation (this binding)", () => {
    test("should preserve this context in trailing mode", async () => {
      const obj = {
        value: 42,
      };

      let capturedThis: any = null;
      const callback = function (this: any) {
        capturedThis = this;
      };

      const debounced = debounce(callback, 50);
      debounced.call(obj);

      await wait(60);
      expect(capturedThis).toBe(obj);
    });

    test("should preserve this context in immediate mode", () => {
      const obj = {
        value: 42,
      };

      let capturedThis: any = null;
      const callback = function (this: any) {
        capturedThis = this;
      };

      const debounced = debounce(callback, 50, true);
      debounced.call(obj);

      expect(capturedThis).toBe(obj);
    });

    test("should use most recent context in trailing mode", async () => {
      const obj1 = { name: "first" };
      const obj2 = { name: "second" };

      let capturedThis: any = null;
      const callback = function (this: any) {
        capturedThis = this;
      };

      const debounced = debounce(callback, 50);
      debounced.call(obj1);
      debounced.call(obj2);

      await wait(60);
      expect(capturedThis).toBe(obj2);
    });
  });

  describe("edge cases", () => {
    test("should handle zero delay", async () => {
      let callCount = 0;
      const callback = () => callCount++;
      const debounced = debounce(callback, 0);

      debounced();
      await wait(10);
      expect(callCount).toBe(1);
    });

    test("should handle callback that throws synchronously in immediate mode", () => {
      const callback = () => {
        throw new Error("Test error");
      };
      const debounced = debounce(callback, 50, true);

      // In immediate mode, the error should be thrown synchronously
      expect(() => debounced()).toThrow("Test error");
    });

    test("should handle callback with no arguments", async () => {
      let called = false;
      const callback = () => {
        called = true;
      };
      const debounced = debounce(callback, 50);

      debounced();
      await wait(60);
      expect(called).toBe(true);
    });

    test("should handle callback with many arguments", async () => {
      let receivedArgs: any[] = [];
      const callback = (...args: any[]) => {
        receivedArgs = args;
      };
      const debounced = debounce(callback, 50);

      debounced(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
      await wait(60);
      expect(receivedArgs).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    test("should work with async callbacks", async () => {
      let resolved = false;
      const callback = async () => {
        resolved = true;
      };
      const debounced = debounce(callback, 50);

      debounced();
      await wait(60);

      expect(resolved).toBe(true);
    });
  });

  describe("integration scenarios", () => {
    test("should simulate search input debouncing", async () => {
      const searchResults: string[] = [];
      const search = (query: string) => {
        searchResults.push(query);
      };
      const debouncedSearch = debounce(search, 100);

      // User types "hello" character by character with small delays
      debouncedSearch("h");
      await wait(20);
      debouncedSearch("he");
      await wait(20);
      debouncedSearch("hel");
      await wait(20);
      debouncedSearch("hell");
      await wait(20);
      debouncedSearch("hello");

      // Only after 100ms of no typing should search execute
      expect(searchResults).toEqual([]);

      await wait(110);
      expect(searchResults).toEqual(["hello"]);
    });

    test("should simulate button click protection with immediate mode", async () => {
      let submitCount = 0;
      const submit = () => submitCount++;
      const debouncedSubmit = debounce(submit, 100, true);

      // User accidentally double-clicks
      debouncedSubmit();
      debouncedSubmit();
      debouncedSubmit();

      // Should only submit once
      expect(submitCount).toBe(1);

      // After cooldown, can submit again
      await wait(110);
      debouncedSubmit();
      expect(submitCount).toBe(2);
    });

    test("should simulate window resize handler", async () => {
      let resizeCount = 0;
      const handleResize = () => resizeCount++;
      const debouncedResize = debounce(handleResize, 50);

      // Simulate rapid resize events
      for (let i = 0; i < 10; i++) {
        debouncedResize();
        await wait(10);
      }

      // Still within debounce period (last call was 0ms ago)
      expect(resizeCount).toBe(0);

      // Wait for debounce to complete
      await wait(60);
      expect(resizeCount).toBe(1);
    });
  });
});
