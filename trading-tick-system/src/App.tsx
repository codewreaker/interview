import { useState, useEffect } from 'react';
import { TickTable } from './TickTable';
//import { dataService } from './dataService';
import type { TickData } from './types';

export const App = () => {
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    console.log('App mounted, subscribing to ticks');
    const unsubscribe = dataService.subscribe((tick) => {
      console.log('Received tick:', tick);
      setTicks((prev) => [tick, ...prev].slice(0, 100));
    });

    return () => unsubscribe();
  }, []);

  const handleStartStreaming = () => {
    console.log('Starting streaming');
    dataService.startStreaming(500);
    setIsStreaming(true);
  };

  const handleStopStreaming = () => {
    console.log('Stopping streaming');
    dataService.stopStreaming();
    setIsStreaming(false);
  };

  const handleClear = () => {
    console.log('Clearing ticks');
    setTicks([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Trading Tick System</h1>
      
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
        <span style={{ marginLeft: '20px' }}>
          Ticks received: <strong>{ticks.length}</strong>
        </span>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: '600px', overflowY: 'auto' }}>
        <TickTable ticks={ticks} />
      </div>
    </div>
  );
};
