/**
 * SOLUTION REFERENCE - DO NOT LOOK UNTIL YOU'VE TRIED!
 * 
 * This file contains a reference implementation of the useStockSubscription hook.
 * Only reference this after attempting your own implementation.
 */

/*
import { useState, useCallback, useRef, useEffect } from 'react';

// Types
interface StockData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

type SortColumn = 'ticker' | 'price' | 'change' | 'changePercent' | 'timestamp';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  column: SortColumn;
  direction: SortDirection;
}

// Custom Hook
function useStockSubscription() {
  // KEY INSIGHT: Use Map for O(1) lookups by ticker
  // This prevents the "flashing" issue because we update specific entries
  const [stocks, setStocks] = useState<Map<string, StockData>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    column: 'timestamp', 
    direction: 'desc' 
  });
  
  // Ref for unsubscribe - doesn't cause re-renders
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // CRITICAL: Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Handle incoming stock update - memoized to prevent recreating
  const handleStockUpdate = useCallback((stockData: StockData) => {
    setStocks(prevStocks => {
      // Create NEW Map to trigger React re-render
      const newStocks = new Map(prevStocks);
      newStocks.set(stockData.ticker, stockData);
      return newStocks;
    });
  }, []);

  // Subscribe to all stocks
  const subscribeToAll = useCallback(() => {
    // Always cleanup existing subscription first
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    setStocks(new Map()); // Clear existing data
    unsubscribeRef.current = subscribeAllStocks(handleStockUpdate);
    setIsConnected(true);
  }, [handleStockUpdate]);

  // Subscribe to single stock
  const subscribeToSingle = useCallback((ticker: string) => {
    if (!ticker.trim()) {
      alert('Please enter a ticker symbol');
      return;
    }

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }
    
    setStocks(new Map());
    unsubscribeRef.current = subscribeStock(ticker.toUpperCase(), handleStockUpdate);
    setIsConnected(true);
  }, [handleStockUpdate]);

  // Unsubscribe from all
  const unsubscribeAll = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    setStocks(new Map());
    setIsConnected(false);
  }, []);

  // Toggle sort direction or change column
  const setSort = useCallback((column: SortColumn) => {
    setSortConfig(prev => ({
      column,
      direction: prev.column === column 
        ? (prev.direction === 'asc' ? 'desc' : 'asc')
        : 'desc'
    }));
  }, []);

  // Compute sorted stocks - derived state
  const sortedStocks = [...stocks.values()].sort((a, b) => {
    let aVal: string | number = a[sortConfig.column];
    let bVal: string | number = b[sortConfig.column];
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }
    
    const modifier = sortConfig.direction === 'asc' ? 1 : -1;
    return aVal > bVal ? modifier : -modifier;
  });

  return {
    stocks,
    isConnected,
    sortConfig,
    subscribeToAll,
    subscribeToSingle,
    unsubscribeAll,
    setSort,
    sortedStocks
  };
}

// Helper functions
function formatPrice(price: number): string {
  return '$' + price.toFixed(2);
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

function formatChange(change: number): string {
  return (change >= 0 ? '+' : '') + change.toFixed(2);
}
*/
