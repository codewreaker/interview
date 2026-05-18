/**
 * Core types for the trading tick system
 */

import type { MSG_TYPES } from "./constants";

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
  type: keyof typeof MSG_TYPES;
  payload: unknown;
}

export interface FlusherStats {
  totalFlushed: number;
  flushCount: number;
  lastFlushTime: number;
  averageFlushSize: number;
}
