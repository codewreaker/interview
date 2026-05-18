/**
 * tick-queue.ts
 *
 * Conflating tick buffer with scheduled batch flushing.
 * Designed to run inside a Web Worker.
 *
 * Conflation is a property of the Map — last write per symbol wins at enqueue
 * time. By flush time the data is already conflated; flush just drains and
 * dispatches.
 */
import { ACTIONS, MSG_TYPES } from "../constants";
import type { TickData, BufferEvent, FlusherStats } from '../types';

// ---------------------------------------------------------------------------
// TickQueue
// ---------------------------------------------------------------------------

type Dispatcher = (event: BufferEvent) => void;

const workerDispatch: Dispatcher = (event) =>
    (self as unknown as Worker).postMessage(event);



export class TickQueue {
    private readonly conflationMap = new Map<string, TickData>();
    private intervalHandle: ReturnType<typeof setInterval> | null = null;
    private readonly flushInterval: Readonly<number>;
    private readonly dispatch: Dispatcher | null;

    private totalFlushed = 0;
    private flushCount = 0;
    private lastFlushTime = 0;
    private averageFlushSize = 0;

    constructor(
        dispatch: Dispatcher,
        flushInterval: Readonly<number> = 1000,
    ) {
        this.dispatch = dispatch;
        this.flushInterval = flushInterval;
    }

    enqueue(tick: TickData): void {
        this.conflationMap.set(tick.symbol, tick);
    }

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    start(): this {
        if (this.intervalHandle !== null) return this;
        this.intervalHandle = setInterval(() => this.flush(), this.flushInterval);
        return this;
    }

    stop(): void {
        if (this.intervalHandle === null) return;
        clearInterval(this.intervalHandle);
        this.intervalHandle = null;
        this.flush(); // drain residual ticks on shutdown
    }

    // -------------------------------------------------------------------------
    // Flush — drain the conflated map, chunk, dispatch
    // -------------------------------------------------------------------------

    private flush(): void {
        if (this.conflationMap.size === 0) return;

        const now = Date.now();
        const ticks = Array.from(this.conflationMap.values()).toSorted((a,b)=>(a.symbol.localeCompare(b.symbol)));
        this.conflationMap.clear();

        // stats
        this.lastFlushTime = now;
        this.flushCount++;
        this.totalFlushed += ticks.length;
        this.lastFlushTime = now;
        this.averageFlushSize += (ticks.length - this.averageFlushSize) / this.flushCount;

        if (this.dispatch === null) {
            console.error('Dispatcher not set for queue, no response!');
            return
        }

        if (this.flushCount % 10 === 1) console.debug(this.getStats());
        this.dispatch({ type: MSG_TYPES.TICK, payload: ticks });
    }

    // -------------------------------------------------------------------------
    // Observability
    // -------------------------------------------------------------------------

    getStats(): Readonly<FlusherStats> {
        return {
            totalFlushed: this.totalFlushed,
            flushCount: this.flushCount,
            lastFlushTime: this.lastFlushTime,
            averageFlushSize: this.averageFlushSize
        };
    }

    get pendingCount(): number {
        return this.conflationMap.size;
    }

    get isRunning(): boolean {
        return this.intervalHandle !== null;
    }
}

// ---------------------------------------------------------------------------
// Worker bootstrap
// ---------------------------------------------------------------------------


let socket: WebSocket | null = null;

self.onmessage = ({ data }: MessageEvent) => {
    switch (data?.action) {
        case ACTIONS.CONNECT:
            connect("ws://localhost:3000")
            break;
        case ACTIONS.DISCONNECT:
            socket?.close(1000, "closed by client");
            break;
        default:
            socket?.send(JSON.stringify({
                action: data.action,
                payload: data?.payload || null
            }))
            break;
    }
};

function connect(url: string) {
    const _socket = new WebSocket(url);
    let queue: TickQueue | null = null;
    socket = _socket;

    _socket.onopen = () => {
        _socket.send(JSON.stringify({ action: ACTIONS.CONNECT }));
        queue = new TickQueue(workerDispatch, 1000).start();
    };

    _socket.onmessage = (event) => {
        if (!queue) return;
        const data = JSON.parse(event.data);
        if ('symbol' in data) {
            queue.enqueue(data);
        } else {
            workerDispatch({
                type: MSG_TYPES.MESSAGE,
                payload: event.data,
            })
        }
    };

    _socket.onerror = (err) => {
        workerDispatch({
            type: MSG_TYPES.ERROR,
            payload: err,
        })
    };

    _socket.onclose = ({ code, wasClean, reason }) => {
        workerDispatch({
            type: MSG_TYPES.CLOSED,
            payload: {
                code, reason, wasClean
            },
        });
    };
}