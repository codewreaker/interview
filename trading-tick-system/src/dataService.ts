import type { TickData } from './types';

/**
 * Mock trading data service that generates realistic live tick data
 */

const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'AMD'];

interface PriceState {
  symbol: string;
  basePrice: number;
  currentPrice: number;
  bid: number;
  ask: number;
  volume: number;
  lastChange: number;
}

class DataService {
  private priceStates: Map<string, PriceState>;
  private subscribers: Set<(tick: TickData) => void> = new Set();
  private tickIntervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.priceStates = new Map();
    this.initializePrices();
  }

  private initializePrices(): void {
    SYMBOLS.forEach((symbol) => {
      const basePrice = 100 + Math.random() * 300;
      this.priceStates.set(symbol, {
        symbol,
        basePrice,
        currentPrice: basePrice,
        bid: basePrice - 0.02,
        ask: basePrice + 0.02,
        volume: Math.floor(Math.random() * 100000),
        lastChange: 0,
      });
    });
  }

  private generateTick(symbol: string): TickData {
    const state = this.priceStates.get(symbol)!;
    
    // Random price movement (-0.5% to +0.5%)
    const changePercent = (Math.random() - 0.5) * 0.01;
    const priceChange = state.currentPrice * changePercent;
    state.currentPrice += priceChange;
    state.lastChange = priceChange;
    
    const spread = state.currentPrice * 0.0002; // 0.02% spread
    state.bid = state.currentPrice - spread / 2;
    state.ask = state.currentPrice + spread / 2;
    
    // Volume with realistic variation
    state.volume = Math.floor(
      (state.volume * 0.7) + Math.random() * state.volume * 0.6
    );

    const change = state.currentPrice - state.basePrice;
    
    return {
      symbol,
      price: parseFloat(state.currentPrice.toFixed(2)),
      bid: parseFloat(state.bid.toFixed(2)),
      ask: parseFloat(state.ask.toFixed(2)),
      volume: state.volume,
      timestamp: Date.now(),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(((change / state.basePrice) * 100).toFixed(2)),
    };
  }

  /**
   * Start streaming ticks at the specified interval
   * @param intervalMs interval in milliseconds between ticks
   */
  startStreaming(intervalMs: number = 1000): void {
    if (this.tickIntervalId) {
      return; // Already streaming
    }

    this.tickIntervalId = setInterval(() => {
      // Generate a tick for a random symbol
      const randomSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const tick = this.generateTick(randomSymbol);
      
      // Notify all subscribers
      this.subscribers.forEach((callback) => callback(tick));
    }, intervalMs);
  }

  /**
   * Stop streaming ticks
   */
  stopStreaming(): void {
    if (this.tickIntervalId) {
      clearInterval(this.tickIntervalId);
      this.tickIntervalId = null;
    }
  }

  /**
   * Subscribe to tick events
   * @param callback function called on each tick
   * @returns unsubscribe function
   */
  subscribe(callback: (tick: TickData) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get current price state for a symbol
   */
  getPrice(symbol: string): TickData | null {
    const state = this.priceStates.get(symbol);
    if (!state) return null;
    
    return {
      symbol: state.symbol,
      price: state.currentPrice,
      bid: state.bid,
      ask: state.ask,
      volume: state.volume,
      timestamp: Date.now(),
      change: state.currentPrice - state.basePrice,
      changePercent: ((state.currentPrice - state.basePrice) / state.basePrice) * 100,
    };
  }

  /**
   * Get all available symbols
   */
  getSymbols(): string[] {
    return SYMBOLS;
  }

  /**
   * Generate multiple ticks at once (useful for backfilling)
   */
  generateBatch(count: number): TickData[] {
    const ticks: TickData[] = [];
    for (let i = 0; i < count; i++) {
      const symbol = SYMBOLS[i % SYMBOLS.length];
      ticks.push(this.generateTick(symbol));
    }
    return ticks;
  }
}

// Export singleton instance
export const dataService = new DataService();
