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
            message: inst.instanceId
        }));

        const cb = (tickData: TickData) => {
            wsRaw?.send(JSON.stringify({
                message: tickData
            }));
        }
        inst.subscribe(cb);
        inst.startStreaming(16);

    },
    onMessage({ data }) {
        const message = JSON.parse(data as string);
        switch (message?.action) {
            case ACTIONS.DISCONNECT:
                DataService.getInstance().stopStreaming();
                break
            default:
                console.log('no handler for', message)
                break;
        }
    },
    onClose(_, sock) {
        DataService.getInstance().stopStreaming();
        sock.close(1006, 'stream stopped due to close')
    }
})))

export type WebsocketApp = typeof app;

export default {
    fetch: app.fetch,
    websocket
};