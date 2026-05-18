/**
 * Interview Question: Rate Limiter
 * 
 * Objective:
 * Design a rate limiter for an API endpoint that limits requests to a maximum of N requests 
 * per minute for each user. When a user exceeds the limit, subsequent requests should be denied.
 * 
 * Requirements:
 * - Allow at most N requests per minute from each user
 * - Track requests per user independently
 * - Return true if request is allowed, false if denied (rate limit exceeded)
 * - Consider how you would handle distributed systems
 * 
 * Questions to consider:
 * - What data structures would you use?
 * - How would you clean up old requests to save memory?
 * - What's the time and space complexity?
 * - How would this work in a distributed system?
 * 
 * Example:
 * limiter = new RateLimiter(3, 60000); // 3 requests per 60 seconds
 * limiter.isAllowed("user1") => true (1st request)
 * limiter.isAllowed("user1") => true (2nd request)
 * limiter.isAllowed("user1") => true (3rd request)
 * limiter.isAllowed("user1") => false (exceeds limit)
 */

export class RateLimiter {
  private maxRequests: number;
  private windowMs: number;
  private userRequests: Map<string, number[]> = new Map();
  
  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(userId: string): boolean {
    // TODO: Implement the solution
    // Approach: Use a sliding window with timestamps for each user
    // Time Complexity: O(n) where n is the number of requests in the window
    // Space Complexity: O(u * r) where u is number of users and r is average requests per window
    
    /*
    const now = Date.now();
    
    // Get or initialize user's request history
    if (!this.userRequests.has(userId)) {
      this.userRequests.set(userId, []);
    }
    
    const requests = this.userRequests.get(userId)!;
    
    // Remove requests outside the window
    while (requests.length > 0 && requests[0] <= now - this.windowMs) {
      requests.shift();
    }
    
    // Check if user has exceeded limit
    if (requests.length < this.maxRequests) {
      requests.push(now);
      return true;
    }
    
    return false;
    */
    
    return false;
  }
  
  // Helper method to reset a user's requests (for testing)
  reset(userId: string): void {
    this.userRequests.delete(userId);
  }
  
  // Helper method to get request count for a user (for testing)
  getRequestCount(userId: string): number {
    return this.userRequests.get(userId)?.length ?? 0;
  }
}

/**
 * Alternative implementation using Token Bucket algorithm:
 * - More scalable for distributed systems
 * - Allows bursts up to the limit
 * - Tokens are added at a constant rate
 */
export class TokenBucketLimiter {
  private maxTokens: number;
  private refillRate: number; // tokens per second
  private userBuckets: Map<string, { tokens: number; lastRefill: number }> = new Map();
  
  constructor(maxTokens: number, refillRate: number) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
  }
  
  isAllowed(userId: string): boolean {
    // TODO: Implement token bucket algorithm
    /*
    const now = Date.now() / 1000; // Convert to seconds
    
    if (!this.userBuckets.has(userId)) {
      this.userBuckets.set(userId, { tokens: this.maxTokens, lastRefill: now });
    }
    
    const bucket = this.userBuckets.get(userId)!;
    
    // Calculate tokens to add
    const timePassed = now - bucket.lastRefill;
    bucket.tokens = Math.min(this.maxTokens, bucket.tokens + timePassed * this.refillRate);
    bucket.lastRefill = now;
    
    // Check if we can consume a token
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }
    
    return false;
    */
    
    return false;
  }
}
