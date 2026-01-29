import { describe, expect, test, mock } from "bun:test";
import { initClock } from "../src/clock";

describe("Clock (Citadel Securities)", () => {

  describe("initClock", () => {
    test("should return a cleanup function", () => {
      const cleanup = initClock(() => {});
      expect(typeof cleanup).toBe("function");
      cleanup();
    });

    test("should pass formatted time string to onTick", async () => {
      let receivedTime = "";
      const cleanup = initClock((time) => { receivedTime = time; });
      
      await sleep(1100);
      cleanup();
      
      // Should match HH:MM:SS format
      expect(receivedTime).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    test("should tick every second", async () => {
      const onTick = mock(() => {});
      const cleanup = initClock(onTick);
      
      await sleep(2100);
      cleanup();
      
      expect(onTick.mock.calls.length).toBeGreaterThanOrEqual(2);
    });

    test("should stop ticking when cleanup is called", async () => {
      const onTick = mock(() => {});
      const cleanup = initClock(onTick);
      
      await sleep(1100);
      cleanup();
      
      const callCount = onTick.mock.calls.length;
      await sleep(1100);
      
      expect(onTick.mock.calls.length).toBe(callCount);
    });
  });
});

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
