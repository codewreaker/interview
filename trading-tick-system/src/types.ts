/**
 * Core types for the trading tick system
 */

export interface TickData {
  symbol: string;
  price: number;
  bid: number;
  ask: number;
  volume: number;
  timestamp: number;
  change: number;
  changePercent: number;
}

export interface BufferEvent {
  type: 'tick' | 'flush' | 'schedule';
  data?: TickData[];
  timestamp: number;
}

export interface SchedulerConfig {
  flushInterval: number; // ms
  maxBufferSize: number; // max ticks before forced flush
  batchSize: number; // ticks per batch
}

export interface FlusherStats {
  totalFlushed: number;
  flushCount: number;
  lastFlushTime: number;
  averageFlushSize: number;
  bufferUtilization: number;
}
