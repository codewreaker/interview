import { Hono } from 'hono';
import { logger } from 'hono/logger'
import { DataService } from './dataService';
import {
    upgradeWebSocket,
    websocket
} from 'hono/bun'
import type { ServerWebSocket } from 'bun'
import type { TickData } from '../types';
import { ACTIONS } from '../constants';

const app = new Hono();

app.use(logger());

app.get('/health', (c) => {
    return c.json({
        ok: true,
        status: 200
    })
});

app.get('/', upgradeWebSocket(() => ({
    onOpen(_, { raw }) {
        const inst = DataService.getInstance();
        const wsRaw = (raw as ServerWebSocket);
        wsRaw?.send(JSON.stringify({
            subId: inst.instanceId
        }));

    },
    onMessage({ data }, sock) {
        const message = JSON.parse(data as string);
        const inst = DataService.getInstance();
        switch (message?.action) {
            case ACTIONS.SUB: {
                const cb = (tickData: TickData) => {
                    sock.send(JSON.stringify(tickData));
                }
                inst.subscribe(cb);
                console.log('SUBDATA', typeof message?.payload, message?.payload);
                inst.startStreaming(message?.payload || 16);
                break
            }
            case ACTIONS.UNSUB:
                DataService.getInstance().stopStreaming();
                break
            case ACTIONS.DISCONNECT:
                sock.close(1006, 'stream stopped due to close')
                break
            default:
                console.log('no handler for', message)
                break;
        }
    },
    onClose() {
        DataService.getInstance().stopStreaming();
    }
})))

export type WebsocketApp = typeof app;

export default {
    fetch: app.fetch,
    websocket
};