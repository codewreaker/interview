import type { TickData } from '../types';

/**
 * Mock trading data service that generates realistic live tick data
 */

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const SYMBOLS = [
  // Mega-Cap & Technology Leaders
  "AAPL", "MSFT", "GOOGL", "GOOG", "AMZN", "NVDA", "META", "TSLA", "AVGO", "AMD", 
  "INTC", "QCOM", "TXN", "AMAT", "LRCX", "ADI", "MU", "PANW", "FTNT", "CRWD", 
  "CSCO", "ORCL", "ADBE", "CRM", "INTU", "SNPS", "CDNS", "WDAY", "TEAM", "DDOG",

  // E-Commerce, Digital Media & Services
  "NFLX", "PDD", "MELI", "BKNG", "JD", "BIDU", "EBAY", "ETSY", "EXPE", "TRIP",
  "ABNB", "DASH", "LYFT", "ZG", "GRUB", "MTCH", "ROKU", "PINS", "SNAP", "TTD",

  // Biotech & Healthcare Pharmaceuticals
  "AMGN", "GILD", "VRTX", "REGN", "BIIB", "SGEN", "MRNA", "BNTX", "ILMN", "ALNY",
  "DXCM", "IDXX", "WBA", "CVS", "ISRG", "BSX", "MDT", "ZBH", "ALXN", "AZN",

  // Consumer, Retail & Automotive
  "SBUX", "COST", "WMT", "MDLZ", "PEP", "KHC", "MNST", "CELH", "ORLY", "AZO",
  "TSCO", "LULU", "ROST", "DLTR", "DG", "ULTA", "HAS", "MAT", "CROX", "NKE",

  // Industrials, Logistics & Semiconductors
  "HON", "LMT", "GE", "AAL", "UAL", "DAL", "LUV", "FAST", "ODFL", "CSX", 
  "NSC", "UNP", "JBHT", "EXPD", "CHRW", "PCAR", "CUMM", "DE", "CAT", "NXPI",

  // Major Index Tracking ETFs & Funds
  "QQQ", "TQQQ", "SQQQ", "ONEQ", "QQQM", "QQQJ", "VXUS", "VTI", "BND", "IEFA"
];

interface PriceState {
  symbol: string;
  basePrice: number;
  currentPrice: number;
  bid: number;
  ask: number;
  volume: number;
  lastChange: number;
  priceHistory: number[];
  rsiValues: number[];
  volatility: number;
}

interface TickIndicators {
  sma20: number;
  sma50: number;
  sma200: number;
  rsi: number;
  volatility: number;
  trend: 'uptrend' | 'downtrend' | 'neutral';
}


export class DataService {
  private priceStates: Map<string, PriceState>;
  private subscribers: Set<(tick: TickData) => void> = new Set();
  private tickIntervalId: NodeJS.Timeout | null = null;
  instanceId: string | null = null



  static instance: DataService | null = null;

  constructor() {
    this.priceStates = new Map();
    this.initializePrices();
    this.instanceId = generateUUID();
  }

  static getInstance = (): DataService => {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance;
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
        priceHistory: Array(500).fill(basePrice),
        rsiValues: Array(14).fill(50),
        volatility: 0,
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

    // Update price history (keep last 500 prices)
    state.priceHistory.push(state.currentPrice);
    if (state.priceHistory.length > 500) {
      state.priceHistory.shift();
    }

    // EXPENSIVE CALCULATIONS
    const indicators = this.calculateIndicators(state);

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

  private calculateSimpleMovingAverage(prices: number[], period: number): number {
    if (prices.length < period) {
      return prices.reduce((a, b) => a + b, 0) / prices.length;
    }
    const subset = prices.slice(-period);
    return subset.reduce((a, b) => a + b, 0) / period;
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;

    let gains = 0;
    let losses = 0;

    for (let i = prices.length - period; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateVolatility(prices: number[], period: number = 20): number {
    if (prices.length < period) return 0;

    const recentPrices = prices.slice(-period);
    const mean = recentPrices.reduce((a, b) => a + b, 0) / period;
    const variance = recentPrices.reduce((sum, price) => {
      return sum + Math.pow(price - mean, 2);
    }, 0) / period;

    return Math.sqrt(variance);
  }

  private calculateTrend(
    sma20: number,
    sma50: number,
    sma200: number
  ): 'uptrend' | 'downtrend' | 'neutral' {
    if (sma20 > sma50 && sma50 > sma200) {
      return 'uptrend';
    } else if (sma20 < sma50 && sma50 < sma200) {
      return 'downtrend';
    }
    return 'neutral';
  }

  private calculateIndicators(state: PriceState): TickIndicators {
    // Calculate moving averages (CPU intensive with 500 price history)
    const sma20 = this.calculateSimpleMovingAverage(state.priceHistory, 20);
    const sma50 = this.calculateSimpleMovingAverage(state.priceHistory, 50);
    const sma200 = this.calculateSimpleMovingAverage(state.priceHistory, 200);

    // Calculate RSI (iterative calculation over 14-period)
    const rsi = this.calculateRSI(state.priceHistory, 14);

    // Calculate volatility (iterative over 20-period)
    const volatility = this.calculateVolatility(state.priceHistory, 20);

    // Determine trend
    const trend = this.calculateTrend(sma20, sma50, sma200);

    // Simulate expensive cross-symbol correlation analysis (VERY EXPENSIVE)
    // Run it multiple times to amplify the cost
    for (let iteration = 0; iteration < 3; iteration++) {
      this.simulateCrossSymbolAnalysis();
    }

    // Additional expensive hash computation for "data integrity"
    this.computeExpensiveHash(state.priceHistory);

    return {
      sma20: parseFloat(sma20.toFixed(2)),
      sma50: parseFloat(sma50.toFixed(2)),
      sma200: parseFloat(sma200.toFixed(2)),
      rsi: parseFloat(rsi.toFixed(2)),
      volatility: parseFloat(volatility.toFixed(4)),
      trend,
    };
  }

  private computeExpensiveHash(prices: number[]): string {
    // Expensive hashing simulation - lots of iterations
    let hash = 0;
    for (let i = 0; i < prices.length; i++) {
      for (let j = 0; j < prices.length; j++) {
        hash += Math.pow(prices[i] * prices[j], 0.5);
      }
    }
    return hash.toString();
  }

  private simulateCrossSymbolAnalysis(): void {
    // Simulate expensive cross-symbol correlation matrix calculations
    // Reduced scope: only analyze top 15 symbols, sample prices instead of all
    const symbols = Array.from(this.priceStates.keys()).slice(0, 15);

    for (let i = 0; i < symbols.length; i++) {
      const symbol1 = symbols[i];
      const state1 = this.priceStates.get(symbol1);
      if (!state1) continue;

      // Calculate correlation with next 5 symbols only
      for (let j = i + 1; j < Math.min(i + 5, symbols.length); j++) {
        const symbol2 = symbols[j];
        const state2 = this.priceStates.get(symbol2);
        if (!state2) continue;

        // Use sampled prices for faster correlation (every 5th price)
        this.calculatePearsonCorrelation(
          this.sampleArray(state1.priceHistory, 5),
          this.sampleArray(state2.priceHistory, 5)
        );
      }
    }
  }

  private sampleArray(arr: number[], sampleRate: number): number[] {
    const sampled: number[] = [];
    for (let i = 0; i < arr.length; i += sampleRate) {
      sampled.push(arr[i]);
    }
    return sampled;
  }

  private calculatePearsonCorrelation(prices1: number[], prices2: number[]): number {
    const len = Math.min(prices1.length, prices2.length);
    if (len === 0) return 0;

    const mean1 = prices1.slice(-len).reduce((a, b) => a + b, 0) / len;
    const mean2 = prices2.slice(-len).reduce((a, b) => a + b, 0) / len;

    let numerator = 0;
    let denominator1 = 0;
    let denominator2 = 0;

    for (let i = 0; i < len; i++) {
      const diff1 = prices1[prices1.length - len + i] - mean1;
      const diff2 = prices2[prices2.length - len + i] - mean2;

      numerator += diff1 * diff2;
      denominator1 += diff1 * diff1;
      denominator2 += diff2 * diff2;
    }

    const denominator = Math.sqrt(denominator1 * denominator2);
    return denominator === 0 ? 0 : numerator / denominator;
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
