import { ACTIONS } from "../constants";

let socket: WebSocket | null = null;

self.onmessage = ({ data }: MessageEvent) => {
    switch (data?.action) {
        case ACTIONS.CONNECT:
            connect("ws://localhost:3000")
            break;

        case ACTIONS.DISCONNECT:
            console.log
            socket?.close()
            break;
        default:
            console.log('fromWorker', data)
            socket?.send(JSON.stringify({
                action: data.action,
                payload: data.data
            }))
            break;
    }
};

function connect(url: string) {
    const _socket = new WebSocket(url);
    socket = _socket;

    _socket.onopen = (event) => {
        console.log('WebSocket client opened', event);
        _socket.send(JSON.stringify({ action: ACTIONS.CONNECT }));
    };

    _socket.onmessage = (event) => {
        self.postMessage({
            type: "MESSAGE",
            payload: event.data,
        });

    };

    _socket.onerror = (err) => {
        self.postMessage({
            type: "ERROR",
            payload: err,
        });

    };

    _socket.onclose = () => {
        self.postMessage({ type: "CLOSED" });
    };
}