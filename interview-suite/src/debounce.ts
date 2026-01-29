/**
 * Interview Question: Debounce Function
 *
 * Context:
 * Debouncing is a technique used to limit how often a function can be called.
 * It's commonly used for handling user input events like search boxes, window resizing,
 * and scroll events where you want to wait until the user has stopped an action
 * before executing expensive operations.
 *
 * Objective:
 * Implement a debounce function that delays invoking a callback until after
 * a specified delay has elapsed since the last time the debounced function was invoked.
 *
 * Requirements:
 *
 * 1. Basic Debounce:
 *    - Return a new function that delays invoking callback until after delay milliseconds
 *      have elapsed since the last time the debounced function was invoked.
 *    - Multiple rapid calls should only result in one callback execution after the delay.
 *
 * 2. Immediate Mode (optional parameter):
 *    - When immediate is true, invoke the callback on the leading edge instead of trailing.
 *    - The callback should fire immediately on the first call.
 *    - Subsequent calls within the delay period should be ignored.
 *    - After the delay expires, the next call will fire immediately again.
 *
 * 3. Context Preservation:
 *    - The callback should be invoked with the correct `this` context.
 *    - All arguments passed to the debounced function should be forwarded to the callback.
 *
 * 4. Timer Reset:
 *    - Each call to the debounced function should reset the delay timer.
 *
 * Function Signature:
 * function debounce<T extends (...args: any[]) => any>(
 *   callback: T,
 *   delay: number,
 *   immediate?: boolean
 * ): (...args: Parameters<T>) => void
 *
 * Example:
 *
 * const debouncedLog = debounce((msg) => console.log(msg), 300);
 * debouncedLog("a"); // Timer starts
 * debouncedLog("b"); // Timer resets
 * debouncedLog("c"); // Timer resets
 * // After 300ms of no calls: logs "c"
 *
 * const immediateLog = debounce((msg) => console.log(msg), 300, true);
 * immediateLog("a"); // Immediately logs "a"
 * immediateLog("b"); // Ignored (within delay)
 * immediateLog("c"); // Ignored (within delay)
 * // After 300ms, next call will fire immediately again
 *
 * Constraints:
 * - delay is a positive integer in milliseconds
 * - callback is a valid function
 * - immediate defaults to false
 *
 * Hints:
 * - Use setTimeout and clearTimeout
 * - Consider using Function.prototype.apply to preserve context
 * - Track the timer ID to know when to allow immediate execution
 */

type AnyFunction = (...args: any[]) => any;

export function debounce<T extends AnyFunction>(
    callback: T,
    delay: number,
    immediate: boolean = false
): (...args: Parameters<T>) => void {
    let timeoutId: number = null;
    return function (...args) {
        clearTimeout(timeoutId);

        if (immediate && (timeoutId == null)) {
            callback.call(this, ...args)
        }

        timeoutId = setTimeout(() => {
            if (!immediate) {
                callback.call(this, ...args);
            }
            timeoutId = null
        }, delay)
    }
}

