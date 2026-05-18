# Trading Tick System

A high-performance React application that demonstrates real-time trading data processing with a production-grade buffer management system, intelligent scheduling, and off-thread processing using SharedWorkers.

## Features

### 1. **Ring Buffer** (`TickBuffer.ts`)
- Memory-efficient circular buffer implementation
- Fixed capacity to prevent unbounded memory growth
- O(1) add and flush operations
- Utilization tracking for monitoring

### 2. **Intelligent Scheduler** (`TickScheduler.ts`)
- Time-based flushing (configurable intervals)
- Size-based flushing (batch thresholds)
- Forced flushing when buffer reaches capacity
- Real-time statistics tracking:
  - Total ticks flushed
  - Flush count and frequency
  - Average flush size
  - Last flush time
  - Buffer utilization percentage

### 3. **Shared Worker** (`tickWorker.ts`)
- Runs tick generation off the main thread
- Simulates high-frequency market data (50ms intervals)
- Multiple message port support for scalability
- Realistic price movements using random walk simulation
- Handles 8 different symbols (AAPL, GOOGL, MSFT, AMZN, TSLA, META, NVDA, AMD)

### 4. **React Integration** (`useTickWorker.ts`)
- Custom React hook for seamless worker integration
- Auto-connect and port management
- Message-driven architecture
- Error handling and state management

### 5. **Interactive UI**
- **Control Panel**: Start/stop and configure system parameters
- **Stats Panel**: Real-time monitoring of buffer metrics
- **Tick Display**: Live table of trading data
- **Symbol Filtering**: Search and filter by trading symbol

## Architecture

### System Overview

```mermaid
graph TB
    subgraph Browser["Browser (React Frontend)"]
        App["App.tsx<br/>State: ticks, isStreaming, subId"]
        TickTable["TickTable.tsx<br/>Display Ticks"]
        App -->|renders| TickTable
    end

    subgraph Worker["Web Worker (sub.ts)"]
        WS["WebSocket Connection<br/>localhost:3000"]
        Queue["TickQueue<br/>Conflation Map"]
        Router["Message Router<br/>CONNECT|DISCONNECT|ACTIONS"]
        Router -->|manages| WS
        WS -->|receives ticks| Queue
        Queue -->|batches every 1000ms| Dispatcher["Dispatch to Main Thread"]
    end

    subgraph Server["Backend Server (Hono - Port 3000)"]
        WSEndpoint["WebSocket Endpoint<br/>GET /"]
        DataSvc["DataService Singleton<br/>manage subscribers"]
        Ticker["Tick Generator<br/>~160 ticks/sec"]
        
        WSEndpoint -->|establish connection| DataSvc
        DataSvc -->|subscribe callback| Ticker
        Ticker -->|generate tick data| DataSvc
    end

    subgraph TickGeneration["Tick Data Generation"]
        Symbols["80+ Symbols<br/>AAPL, GOOGL, etc"]
        PriceState["Price State per Symbol<br/>- current price<br/>- bid/ask spreads<br/>- volume<br/>- price history"]
        RandWalk["Random Walk<br/>-0.5% to +0.5%<br/>per tick"]
        
        Symbols -->|init| PriceState
        RandWalk -->|update| PriceState
    end

    App -->|create Worker| Worker
    App -->|postMessage: CONNECT| Router
    App -->|postMessage: SUBSCRIBE| WS
    Worker -->|postMessage: TICK data| App
    
    WS -->|register subscriber| DataSvc
    DataSvc -->|send tick to all subscribers| WSEndpoint
    
    style App fill:#e1f5ff
    style TickTable fill:#e1f5ff
    style Worker fill:#fff3e0
    style Queue fill:#fff3e0
    style Server fill:#f3e5f5
    style WSEndpoint fill:#f3e5f5
    style DataSvc fill:#f3e5f5
    style Ticker fill:#f3e5f5
    style TickGeneration fill:#e8f5e9
```

### Message Flow

```mermaid
sequenceDiagram
    participant React as React App<br/>App.tsx
    participant Worker as Web Worker<br/>sub.ts
    participant Server as Backend Server<br/>Hono + DataService
    participant UI as UI<br/>TickTable

    React->>Worker: postMessage({action: CONNECT})
    Worker->>Server: WebSocket connect to ws://localhost:3000
    Server-->>Worker: connection established
    Worker->>Server: send {action: CONNECT}
    
    React->>Worker: postMessage({action: SUB, payload: 16})
    Worker->>Server: send {action: SUB, payload: 16}
    Server->>Server: DataService.subscribe(callback)
    Server->>Server: startStreaming(16)
    
    loop Every tick (~20ms intervals per symbol)
        Server->>Server: generateTick() for each of 8 symbols<br/>Random walk price movement<br/>~160 ticks/sec total
        Server-->>Worker: send TickData<br/>{symbol, price, bid, ask, volume, timestamp}
    end
    
    loop Every 1000ms (flush interval)
        Worker->>Worker: TickQueue.flush()
        Note over Worker: Conflate ticks: Map[symbol] = latestTick<br/>Only latest tick per symbol kept
        Worker-->>React: postMessage({type: TICK, payload: [tick1, tick2, ...]})
    end
    
    React->>React: setTicks(payload)
    React->>UI: re-render table with latest ticks
    
    Note over React,Server: Stats tracked in TickQueue:<br/>- totalFlushed<br/>- flushCount<br/>- averageFlushSize (~16-20 ticks)
```

## Key Concepts

### TickQueue Conflation Pattern

The heart of the system is the **conflation pattern** implemented in `TickQueue`, which uses a `Map<symbol, TickData>` for intelligent tick buffering:

```mermaid
graph LR
    subgraph Input["Incoming Ticks<br/>from Server"]
        T1["AAPL @ 150.25"]
        T2["GOOGL @ 140.50"]
        T3["AAPL @ 150.30<br/>newer"]
        T4["MSFT @ 420.10"]
    end
    
    subgraph Buffer["TickQueue Conflation<br/>Map Based"]
        M1["AAPL → {price: 150.30}<br/>latest wins"]
        M2["GOOGL → {price: 140.50}"]
        M3["MSFT → {price: 420.10}"]
    end
    
    subgraph Flush["Flush Event<br/>Every 1000ms"]
        Array["[AAPL, GOOGL, MSFT]<br/>Only 3 ticks<br/>not 4"]
    end
    
    subgraph Output["Dispatch to UI"]
        Send["postMessage({<br/>type: TICK,<br/>payload: ticks<br/>})"]
    end
    
    T1 -->|enqueue| Buffer
    T2 -->|enqueue| Buffer
    T3 -->|overwrites| Buffer
    T4 -->|enqueue| Buffer
    
    Buffer -->|sorted| Flush
    Flush -->|batched| Send
    
    style Input fill:#fff9c4
    style Buffer fill:#c8e6c9
    style Flush fill:#bbdefb
    style Output fill:#ffccbc
```

**Conflation Benefits:**
- Message volume: 160 ticks/sec → ~20 ticks/sec to UI
- Reduces DOM re-renders by 8x
- Last write wins: only latest price per symbol matters
- O(1) map operations for enqueue
- Memory efficient: fixed conflation map size

### Buffer Management
The conflation map uses last-write-wins semantics:
```typescript
enqueue(tick: TickData): void {
  this.conflationMap.set(tick.symbol, tick);
}
```

When flushing, only the latest tick per symbol is sent to the UI:
```typescript
private flush(): void {
  if (this.conflationMap.size === 0) return;
  
  const ticks = Array.from(this.conflationMap.values())
    .toSorted((a,b) => a.symbol.localeCompare(b.symbol));
  this.conflationMap.clear();
  
  this.dispatch({ type: MSG_TYPES.TICK, payload: ticks });
}
```

### Design Patterns

| Pattern | Implementation | Benefit |
|---------|---|---|
| **Conflation** | Map[symbol] = latestTick | Reduces downstream message load by 8x |
| **Time-based Batching** | 1000ms flush interval | Removes per-tick latency overhead |
| **Singleton** | DataService.getInstance() | Single source of truth for market data |
| **Worker Pattern** | Web Worker isolation | Keeps heavy lifting off main thread |
| **Producer-Consumer** | Server generates, Worker buffers, UI consumes | Decoupled, async data flow |
| **Pub-Sub** | DataService callbacks | Multiple subscribers, single source |

### Performance Characteristics
- **Tick Generation**: 20 ticks/symbol × 8 symbols = ~160 ticks/sec
- **After Conflation**: Only latest tick per symbol (~20 ticks/sec to UI)
- **Flush Frequency**: 1 batched message per second
- **UI Updates**: ~20 rows per update (one per tracked symbol)
- **Memory**: O(1) - fixed conflation map size
- **Latency**: ~1000ms (controlled flush interval)
- **Throughput**: 160 ticks captured, ~20 delivered to UI

## Configuration

The system is highly configurable:

```typescript
interface SchedulerConfig {
  flushInterval: number;    // Time between flushes (10-500ms)
  maxBufferSize: number;    // Ring buffer capacity (100-2000)
  batchSize: number;        // Min ticks before flush (10-500)
}
```

Adjust these values in the Control Panel for different performance characteristics.

## Running the Application

### Development
```bash
bun install
bun run dev
```

Access the app at `http://localhost:5173/`

### Build
```bash
bun run build
```

### Preview
```bash
bun run preview
```

## Use Cases

1. **High-Frequency Trading Systems**: Efficient tick buffering and batch processing
2. **Real-time Analytics**: Stream processing with configurable flushing
3. **IoT Data Collection**: Batch collection and periodic transmission
4. **Event Processing**: Time-windowed and size-windowed aggregation
5. **Market Data Feeds**: Live feeds with intelligent batching

## Learning Points

This project demonstrates:

✅ Ring buffer data structures  
✅ Shared Worker usage in React  
✅ Message-passing architecture  
✅ Scheduler and flushing patterns  
✅ Real-time statistics tracking  
✅ Responsive UI with WebWorkers  
✅ Production-grade error handling  
✅ TypeScript type safety  

## Browser Support

- Chrome/Chromium 79+
- Firefox 79+
- Safari 15.1+
- Edge 79+

SharedWorkers require modern browser support. Check [caniuse.com](https://caniuse.com/sharedworkers) for details.

## Code Organization

```
src/
├── types.ts              # Core type definitions
├── TickBuffer.ts         # Ring buffer implementation
├── TickScheduler.ts      # Scheduler and flusher
├── tickWorker.ts         # SharedWorker script
├── useTickWorker.ts      # React hook
├── ControlPanel.tsx      # Control UI
├── ControlPanel.css
├── StatsPanel.tsx        # Statistics UI
├── StatsPanel.css
├── TickDisplay.tsx       # Tick table UI
├── TickDisplay.css
├── App.tsx              # Main app component
├── App.css              # App styles
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## Performance Tips

1. **Increase flush interval** for lower CPU usage, higher latency
2. **Decrease batch size** for more frequent, smaller flushes
3. **Increase buffer capacity** to handle traffic spikes
4. **Monitor buffer utilization** to prevent capacity exhaustion

## Future Enhancements

- [ ] Multiple worker instances for horizontal scaling
- [ ] Persistent storage integration
- [ ] WebSocket data source
- [ ] Compression for batch transfers
- [ ] Advanced filtering and aggregation
- [ ] Performance profiling dashboard
- [ ] Historical data replay

## License

MIT

---

**Built with React, TypeScript, Vite, and Bun**

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
