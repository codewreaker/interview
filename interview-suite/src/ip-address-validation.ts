/**
 * Interview Question: Restore IP Addresses
 * 
 * Objective:
 * Given a string containing digits, return all possible valid IP addresses that can be obtained 
 * by inserting dots. Validation rules:
 * - Each number must be between 0 and 255
 * - No leading zeros (except the number 0 itself)
 * - Must result in exactly 4 parts
 * 
 * Requirements:
 * - Return all valid IP address combinations
 * - Consider edge cases and validation rules
 * - Discuss the time and space complexity
 * 
 * Example:
 * Input: "25525511135"
 * Output: ["255.255.11.135", "255.255.111.35"]
 * 
 * Input: "0000"
 * Output: ["0.0.0.0"]
 * 
 * Input: "101023"
 * Output: ["1.0.10.23", "1.0.102.3", "10.1.0.23", "10.10.2.3", "101.0.2.3"]
 */

export function restoreIpAddresses(s: string): string[] {
  // TODO: Implement the solution
  // Approach: Use backtracking to try all possible combinations
  // Time Complexity: O(3^4) = O(81) for trying at most 3 choices per part
  // Space Complexity: O(4) = O(1) for the recursion depth (4 parts)
  
  /*
  const result: string[] = [];
  
  const isValid = (s: string): boolean => {
    if (s.length === 0 || s.length > 3) return false;
    if (s[0] === '0' && s.length > 1) return false; // No leading zeros
    return parseInt(s) <= 255;
  };
  
  const backtrack = (index: number, parts: string[], current: string): void => {
    if (parts.length === 4) {
      if (index === s.length) {
        result.push(current.slice(0, -1)); // Remove trailing dot
      }
      return;
    }
    
    // Try taking 1, 2, or 3 characters
    for (let i = 1; i <= 3 && index + i <= s.length; i++) {
      const part = s.substring(index, index + i);
      if (isValid(part)) {
        backtrack(index + i, [...parts, part], current + part + '.');
      }
    }
  };
  
  backtrack(0, [], '');
  return result;
  */
  
  return [];
}

// Helper function to validate a single IP part
export function isValidIpPart(s: string): boolean {
  // TODO: Implement
  /*
  if (s.length === 0 || s.length > 3) return false;
  if (s[0] === '0' && s.length > 1) return false; // No leading zeros
  const num = parseInt(s);
  return num >= 0 && num <= 255 && !isNaN(num);
  */
  return false;
}

// Helper function to validate complete IP address
export function isValidIpAddress(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    if (part.length === 0 || part.length > 3) return false;
    if (part[0] === '0' && part.length > 1) return false;
    const num = parseInt(part);
    return num >= 0 && num <= 255 && !isNaN(num);
  });
}
