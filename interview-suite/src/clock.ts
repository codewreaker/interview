/**
 * Interview Question: Implement a Clock in JavaScript 
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
const formatTime = (now: Date) => {

}

export const initClock = (onTick: (time: string) => void = console.log): () => void => {
    const tick=()=>{
        const t = (new Date(Date.now())).toLocaleTimeString('en-GB');
        onTick(t)
    }

    const intervalId = setInterval(tick, 1000);
    return ()=>clearInterval(intervalId);
};