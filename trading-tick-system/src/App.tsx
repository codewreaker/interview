import { useState } from 'react';
import { TickTable } from './TickTable';
import type { TickData } from './types';
import './App.css'
import { ACTIONS } from './constants';

const worker = new Worker(new URL('./workers/sub.ts', import.meta.url), {
  type: 'module'
});

worker.onmessage = (event)=>{
  console.log('from worker to client', event.data)

}


export const App = () => {
  const [ticks, setTicks] = useState<TickData[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleStartStreaming = () => {
    worker.postMessage({
      action: ACTIONS.CONNECT
    })
    // implement
    setIsStreaming(true);
  };

  const handleStopStreaming = () => {
    worker.postMessage({
      action: ACTIONS.DISCONNECT
    })
    // implement
    setIsStreaming(false);
  };

  const handleClear = () => {
    console.log('Clearing ticks');
    setTicks([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div className='title-header'>
        <h1>Trading Tick System</h1>
        {/* <img src={commentIcon}></img> */}
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
