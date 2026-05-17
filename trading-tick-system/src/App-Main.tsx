// APP_MAIN.tsx - Main Thread Approach (EXPENSIVE)
import { useEffect, useRef, useState } from 'react';
import { TickTable } from './TickTable';
import type { TickData } from './types';
import './App.css';
import { DataService } from './server/dataService';

export const App = () => {
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [subId, setSubId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const dataServiceRef = useRef<DataService | null>(null);
  const dataMap = useRef<Map<string, TickData>>(new Map());
  const counterDomRef = useRef<HTMLDivElement>(null);
  const tickCounterRef = useRef(0);

  // Initialize DataService on mount
  useEffect(() => {
    const service = new DataService();
    dataServiceRef.current = service;
    setSubId(service.instanceId);
    setIsConnected(true);

    return () => {
      if (isStreaming) {
        service.stopStreaming();
      }
      dataServiceRef.current = null;
    };
  }, []);

  const handleStartStreaming = () => {
    if (!dataServiceRef.current) return;

    const service = dataServiceRef.current;

    // Subscribe to ticks from DataService
    service.subscribe((tick) => {
      // SYNCHRONOUS DOM UPDATE - This CANNOT be batched and WILL block UI
      tickCounterRef.current++;
      if (counterDomRef.current) {
        counterDomRef.current.textContent = `Live Ticks: ${tickCounterRef.current}`;
        counterDomRef.current.style.backgroundColor = 
          tickCounterRef.current % 2 === 0 ? '#ffcccc' : '#ff9999';
      }

      dataMap.current.set(tick.symbol, tick);
      setTicks(Array.from(dataMap.current.values()));
    });

    // Start generating ticks on main thread (EXPENSIVE - will block UI)
    service.startStreaming(16);
    setIsStreaming(true);
  };

  const handleStopStreaming = () => {
    if (!dataServiceRef.current) return;

    dataServiceRef.current.stopStreaming();
    setIsStreaming(false);
  };

  const toggleConnection = () => {
    if (isConnected) {
      handleStopStreaming();
      setIsConnected(false);
      dataServiceRef.current = null;
      setSubId(null);
    } else {
      const service = new DataService();
      dataServiceRef.current = service;
      setSubId(service.instanceId);
      setIsConnected(true);
    }
  };

  const handleClear = () => {
    console.log('Clearing ticks');
    dataMap.current.clear();
    setTicks([]);
    tickCounterRef.current = 0;
    if (counterDomRef.current) {
      counterDomRef.current.textContent = 'Live Ticks: 0';
      counterDomRef.current.style.backgroundColor = '#f0f0f0';
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div className='title-header'>
        <h1>Trading Tick System - Main Thread (EXPENSIVE)</h1>
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
        ref={counterDomRef}
        style={{
          padding: '12px',
          marginBottom: '20px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px',
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333',
          transition: 'background-color 0.1s',
        }}
      >
        Live Ticks: 0
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