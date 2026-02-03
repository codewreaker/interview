/**
 * Stock API - Mock Implementation
 * DO NOT MODIFY - This simulates real-time stock data streaming
 */

export interface StockData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

const MOCK_STOCKS = [
  { ticker: 'AAPL', basePrice: 178.50 },
  { ticker: 'GOOGL', basePrice: 141.25 },
  { ticker: 'MSFT', basePrice: 378.90 },
  { ticker: 'AMZN', basePrice: 178.35 },
  { ticker: 'META', basePrice: 505.75 },
  { ticker: 'TSLA', basePrice: 248.50 },
  { ticker: 'NVDA', basePrice: 875.25 },
  { ticker: 'JPM', basePrice: 195.80 },
  { ticker: 'V', basePrice: 279.45 },
  { ticker: 'WMT', basePrice: 165.20 }
];

function generateStockUpdate(stock: { ticker: string; basePrice: number }): StockData {
  const changePercent = (Math.random() - 0.5) * 4;
  const change = stock.basePrice * (changePercent / 100);
  const price = stock.basePrice + change;
  
  return {
    ticker: stock.ticker,
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    timestamp: Date.now()
  };
}

/**
 * Subscribe to all stocks - returns unsubscribe function
 * @example
 * const unsubscribe = subscribeAllStocks((stockData) => {
 *   console.log(stockData); // { ticker, price, change, changePercent, timestamp }
 * });
 */
export function subscribeAllStocks(callback: (data: StockData) => void): () => void {
  const intervals: number[] = [];
  
  MOCK_STOCKS.forEach(stock => {
    const interval = window.setInterval(() => {
      callback(generateStockUpdate(stock));
    }, 500 + Math.random() * 1500);
    intervals.push(interval);
  });

  MOCK_STOCKS.forEach(stock => {
    setTimeout(() => callback(generateStockUpdate(stock)), Math.random() * 500);
  });

  return () => intervals.forEach(clearInterval);
}

/**
 * Subscribe to a single stock - returns unsubscribe function
 * @example
 * const unsubscribe = subscribeStock('AAPL', (stockData) => {
 *   console.log(stockData);
 * });
 */
export function subscribeStock(ticker: string, callback: (data: StockData) => void, onError:(error:Error)=>void): () => void {
  const stock = MOCK_STOCKS.find(s => s.ticker === ticker.toUpperCase());
  
  if (!stock) {
    onError?.(new Error(`Stock ${ticker} not found. Available: ${MOCK_STOCKS.map(s => s.ticker).join(', ')}`));
    return () => {};
  }

  callback(generateStockUpdate(stock));

  const interval = window.setInterval(() => {
    callback(generateStockUpdate(stock));
  }, 500 + Math.random() * 1000);

  return () => clearInterval(interval);
}

export const AVAILABLE_TICKERS = MOCK_STOCKS.map(s => s.ticker);
