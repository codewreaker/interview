import { ACTIONS } from "../constants";

let socket: WebSocket | null = null;

self.onmessage = ({ data }: MessageEvent) => {
    switch (data?.action) {
        case ACTIONS.CONNECT:
            connect("ws://localhost:3000")
            break;
        // case ACTIONS.DISCONNECT:
        //     //socket?.close(1000, "closed by client");
        //     break;

        default:
            socket?.send(JSON.stringify({
                action: data.action
            }))
            break;
    }
};

function connect(url: string) {
    const _socket = new WebSocket(url);
    socket = _socket;

    _socket.onopen = () => {
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

    _socket.onclose = ({ code, wasClean, reason}) => {
        //const reason = (code === 1005 && wasClean) ? 'closed by client' : 'closed from server';
        self.postMessage({
            type: "CLOSED",
            payload: {
                code, reason, wasClean
            },
        });
    };
}