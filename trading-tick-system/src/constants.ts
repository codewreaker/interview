
export const MSG_TYPES = {
    ERROR: "ERROR",
    CLOSED: "CLOSED",
    MESSAGE: "MESSAGE"
} as const
export const ACTIONS = {
    CONNECT: 'connect',
    SUB: 'subscribe',
    UNSUB: 'unsubscribe',
    DISCONNECT: 'disconnect',
    PRICE: 'getPrice',
    SYMBOLS: 'getSymbols'

} as const