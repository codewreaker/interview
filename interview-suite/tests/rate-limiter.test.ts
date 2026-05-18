import { describe, expect, test, beforeEach } from "bun:test";
import { RateLimiter, TokenBucketLimiter } from "../src/rate-limiter";

describe("Rate Limiter", () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter(3, 60000); // 3 requests per 60 seconds
  });

  test("should allow requests within limit", () => {
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
  });

  test("should deny requests exceeding limit", () => {
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(false);
  });

  test("should track different users independently", () => {
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(false);
    
    // user2 should have their own quota
    expect(limiter.isAllowed("user2")).toBe(true);
    expect(limiter.isAllowed("user2")).toBe(true);
    expect(limiter.isAllowed("user2")).toBe(true);
    expect(limiter.isAllowed("user2")).toBe(false);
  });

  test("should handle single request limit", () => {
    const strictLimiter = new RateLimiter(1, 60000);
    expect(strictLimiter.isAllowed("user1")).toBe(true);
    expect(strictLimiter.isAllowed("user1")).toBe(false);
  });

  test("should handle reset of user", () => {
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(false);
    
    limiter.reset("user1");
    expect(limiter.isAllowed("user1")).toBe(true);
  });

  test("should get correct request count", () => {
    expect(limiter.getRequestCount("user1")).toBe(0);
    limiter.isAllowed("user1");
    expect(limiter.getRequestCount("user1")).toBe(1);
    limiter.isAllowed("user1");
    expect(limiter.getRequestCount("user1")).toBe(2);
  });

  test("should handle many users concurrently", () => {
    for (let i = 0; i < 100; i++) {
      expect(limiter.isAllowed(`user${i}`)).toBe(true);
    }
    
    for (let i = 0; i < 100; i++) {
      expect(limiter.isAllowed(`user${i}`)).toBe(true);
      expect(limiter.isAllowed(`user${i}`)).toBe(true);
      expect(limiter.isAllowed(`user${i}`)).toBe(false);
    }
  });
});

describe("Token Bucket Limiter", () => {
  test("should allow requests within limit", () => {
    const limiter = new TokenBucketLimiter(5, 1); // 5 tokens, 1 token per second
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
  });

  test("should deny requests when bucket is empty", () => {
    const limiter = new TokenBucketLimiter(3, 0.1);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(false);
  });

  test("should track different users independently", () => {
    const limiter = new TokenBucketLimiter(2, 1);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(true);
    expect(limiter.isAllowed("user1")).toBe(false);
    
    expect(limiter.isAllowed("user2")).toBe(true);
    expect(limiter.isAllowed("user2")).toBe(true);
    expect(limiter.isAllowed("user2")).toBe(false);
  });
});
