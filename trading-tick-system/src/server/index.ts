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
        switch (data?.action) {
            case ACTIONS.PRICE:

                break;
            case ACTIONS.SUB:

                break;
            case ACTIONS.SYMBOLS:

                break;
            default:
                console.log(data)
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