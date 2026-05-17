// APP_MAIN.tsx
import { useCallback, useEffect, useRef, useState } from 'react';
import { TickTable } from './TickTable';
import type { TickData } from './types';
import './App.css';
import { ACTIONS, MSG_TYPES } from './constants';

export const App = () => {
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [subId, setSubId] = useState<string | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const dataMap = useRef<Map<string, TickData>>(new Map());

  const handleMessages = useCallback(
    ({ data }: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(data) as TickData & {
          subId?: string;
        };

        if (payload.subId) {
          setSubId(payload.subId);
          return;
        }

        dataMap.current.set(payload.symbol, payload);

        setTicks(Array.from(dataMap.current.values()));
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const connect = useCallback(
    (url: string) => {
      const existingSocket = socketRef.current;

      // Prevent duplicate sockets
      if (
        existingSocket &&
        (
          existingSocket.readyState === WebSocket.OPEN ||
          existingSocket.readyState === WebSocket.CONNECTING
        )
      ) {
        return;
      }

      const socket = new WebSocket(url);

      socketRef.current = socket;

      socket.onopen = () => {
        console.log('Socket connected');

        setIsConnected(true);

        socket.send(
          JSON.stringify({
            action: ACTIONS.CONNECT,
          })
        );
      };

      socket.onmessage = handleMessages;

      socket.onerror = (err) => {
        console.error(MSG_TYPES.ERROR, err);
      };

      socket.onclose = ({ code, wasClean, reason }) => {
        console.log(MSG_TYPES.CLOSED, {
          code,
          reason,
          wasClean,
        });

        setIsConnected(false);
        setIsStreaming(false);
        setSubId(null);

        socketRef.current = null;
      };
    },
    [handleMessages]
  );

  useEffect(() => {
    connect('ws://localhost:3000');

    return () => {
      const socket = socketRef.current;

      if (
        socket &&
        (
          socket.readyState === WebSocket.OPEN ||
          socket.readyState === WebSocket.CONNECTING
        )
      ) {
        socket.close(1000, 'closed by client');
      }

      socketRef.current = null;
    };
  }, [connect]);

  const handleStartStreaming = () => {
    if (!isConnected) return;

    socketRef.current?.send(
      JSON.stringify({
        action: ACTIONS.SUB,
      })
    );

    setIsStreaming(true);
  };

  const handleStopStreaming = () => {
    if (!isConnected) return;

    socketRef.current?.send(
      JSON.stringify({
        action: ACTIONS.UNSUB,
      })
    );

    setIsStreaming(false);
  };

  const toggleConnection = () => {
    const socket = socketRef.current;

    if (
      socket &&
      (
        socket.readyState === WebSocket.OPEN ||
        socket.readyState === WebSocket.CONNECTING
      )
    ) {
      socket.close(1000, 'closed by client');
      return;
    }

    connect('ws://localhost:3000');
  };

  const handleClear = () => {
    console.log('Clearing ticks');

    dataMap.current.clear();
    setTicks([]);
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div className='title-header'>
        <h1>Trading Tick System</h1>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleStartStreaming}
          disabled={!isConnected || isStreaming}
        >
          Start Streaming
        </button>

        <button
          onClick={handleStopStreaming}
          disabled={!isConnected || !isStreaming}
          style={{ marginLeft: '10px' }}
        >
          Stop Streaming
        </button>

        <button
          onClick={handleClear}
          style={{ marginLeft: '10px' }}
        >
          Clear
        </button>

        <button
          onClick={toggleConnection}
          style={{
            marginLeft: '10px',
            backgroundColor: 'red',
          }}
        >
          {isConnected ? 'DISCONNECT' : 'CONNECT'}
        </button>

        <span style={{ marginLeft: '20px' }}>
          Ticks received: <strong>{ticks.length}</strong>

          {' | '}

          Status:{' '}
          <strong>
            {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
          </strong>

          {' | '}

          SubId: <strong>{subId ?? 'N/A'}</strong>
        </span>
      </div>

      <div
        style={{
          overflowX: 'auto',
          maxHeight: '600px',
          overflowY: 'auto',
        }}
      >
        <TickTable ticks={ticks} />
      </div>
    </div>
  );
};