import { useCallback, useEffect, useState, useRef } from 'react';
import { TickTable } from './TickTable';
import type { TickData } from './types';
import './App.css'
import { ACTIONS, MSG_TYPES } from './constants';



export const App = () => {
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [subId, setSubId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const dataMap = useRef<Map<string, TickData> | null>(new Map());
  const counterDomRef = useRef<HTMLDivElement>(null);
  const tickCounterRef = useRef(0);

  const handleMessages = useCallback(({ data }: MessageEvent<{ type: keyof typeof MSG_TYPES, payload: string }>) => {
    try {
      if (data.type === MSG_TYPES.MESSAGE) {
        const payload = JSON.parse(data.payload) as TickData & { subId?: string };
        if (payload.subId) {
          setSubId(payload.subId);
          return
        }

        if(dataMap?.current === null) return;

        // SYNCHRONOUS DOM UPDATE - Show live tick counter
        tickCounterRef.current++;
        if (counterDomRef.current) {
          counterDomRef.current.textContent = `Live Ticks: ${tickCounterRef.current}`;
          counterDomRef.current.style.backgroundColor = 
            tickCounterRef.current % 2 === 0 ? '#ccffcc' : '#99ff99';
        }

        dataMap.current.set(payload.symbol, payload);
        
        setTicks(Array.from(dataMap.current.values()))
      } 
    } catch (error) {
      console.error(error)
    }

  }, []);



  useEffect(() => {
    const worker = new Worker(new URL('./workers/sub.ts', import.meta.url), {
      type: 'module'
    });

    workerRef.current = worker;

    worker.postMessage({
      action: ACTIONS.CONNECT
    });

    worker.onmessage = handleMessages;

    return () => {
      worker.postMessage({
        action: ACTIONS.DISCONNECT
      });
      workerRef.current = null;
      worker.terminate();
    }
  }, [handleMessages])

  const handleStartStreaming = () => {
    // implement
    setIsStreaming(() => {
      workerRef.current?.postMessage({
        action: ACTIONS.SUB
      });
      return true
    });
  };

  const handleStopStreaming = () => {
    workerRef.current?.postMessage({
      action: ACTIONS.UNSUB
    })
    // implement
    setIsStreaming(false);
  };

  const toggleConnection = () => {
    if (subId) {
      workerRef.current?.postMessage({
        action: ACTIONS.DISCONNECT
      });
      setSubId(null);
      setIsStreaming(false);
    } else {
      workerRef.current?.postMessage({
        action: ACTIONS.CONNECT
      });
    }
  }

  const handleClear = () => {
    console.log('Clearing ticks');
    setTicks([]);
    tickCounterRef.current = 0;
    if (counterDomRef.current) {
      counterDomRef.current.textContent = 'Live Ticks: 0';
      counterDomRef.current.style.backgroundColor = '#f0f0f0';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className='title-header'>
        <h1>Trading Tick System - Web Worker (RESPONSIVE)</h1>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleStartStreaming} disabled={isStreaming}>
          Start Streaming
        </button>
        <button onClick={handleStopStreaming} disabled={!isStreaming} style={{ marginLeft: '10px' }}>
          Stop Streaming
        </button>
        <button onClick={handleClear} style={{ marginLeft: '10px' }}>
          Clear
        </button>
        <button onClick={toggleConnection} style={{ marginLeft: '10px', backgroundColor: 'red' }}>
          {subId ? 'DISCONNECT':'CONNECT'}
        </button>
        <span style={{ marginLeft: '20px'}}>
          Ticks received: <strong>{ticks.length}</strong>
          {` SubId`}: <strong>{subId}</strong>
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

      <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
        <TickTable ticks={ticks} />
      </div>
    </div>
  );
};
