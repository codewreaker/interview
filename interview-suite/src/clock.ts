/**
 * Interview Question: Implement a Clock in JavaScript (Citadel Securities - UI)
 *
 * Requirements:
 * 1. formatTime(date: Date): string - Format as "HH:MM:SS" (24-hour, zero-padded)
 * 2. initClock(onTick) - Calls onTick every second with formatted time, returns cleanup fn
 *
 * Examples:
 * formatTime(new Date("2025-01-27T09:05:03")) → "09:05:03"
 *
 * const cleanup = initClock((time) => console.log(time));
 * cleanup(); // stops the clock
 */

export const initClock = (onTick: (time: string) => void = console.log): () => void => {
    const tick = (now: Date) => {
        const hours = String(now.getHours()).padStart(2, "0");
        const min = String(now.getMinutes()).padStart(2, "0");
        const secs = String(now.getSeconds()).padStart(2, "0");
        return `${hours}:${min}:${secs}`
    }

    onTick(tick(new Date()));

    const intervalId = setInterval(() => {
        onTick(tick(new Date()))
    }, 1000);

    return () => {
        clearInterval(intervalId)
    }
};