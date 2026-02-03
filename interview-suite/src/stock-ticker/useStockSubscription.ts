import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { subscribeAllStocks, subscribeStock, type StockData } from './stockApi';

// ============================================================================
// Types & Interfaces
// ============================================================================

export type SubscriptionMode = 'single' | 'all' | 'none';

export type ConnectionStatus = 
  | { state: 'disconnected' }
  | { state: 'connected'; mode: 'all' }
  | { state: 'connected'; mode: 'single'; ticker: string };

export type SortDirection = 'asc' | 'desc' | 'none';

export interface SortConfig {
  column: keyof StockData;
  direction: SortDirection;
}

interface UseStockSubscriptionOptions {
  defaultSort?: SortConfig;
  onError?: (error: Error, ticker: string) => void;
  onConnect?: (mode: SubscriptionMode, ticker?: string) => void;
}

interface UseStockSubscriptionReturn {
  /** Sorted stock data array */
  data: StockData[];
  /** Current connection status */
  status: ConnectionStatus;
  /** Whether currently connected to any subscription */
  isConnected: boolean;
  /** Current error message, if any */
  error: string | null;
  /** Current sort configuration */
  sortConfig: SortConfig | null;
  /** Subscribe to all stocks */
  subscribeAll: () => void;
  /** Subscribe to a single ticker */
  subscribeSingle: (ticker: string) => void;
  /** Unsubscribe from all */
  unsubscribe: () => void;
  /** Clear current error */
  clearError: () => void;
  /** Update sort configuration */
  setSortConfig: React.Dispatch<React.SetStateAction<SortConfig | null>>;
  /** Handle column header click (cycles through sort directions) */
  handleColumnSort: (column: keyof StockData) => void;
  /** Raw tick count for debugging */
  tickCount: number;
}

// ============================================================================
// Sorting Utilities
// ============================================================================

const getNextSortDirection = (current: SortConfig, column: keyof StockData): SortDirection => {
  if (current.column !== column) return 'desc'; // New column starts descending
  
  // Cycle: desc → asc → none → desc
  const cycle: Record<SortDirection, SortDirection> = {
    desc: 'asc',
    asc: 'none',
    none: 'desc',
  };
  return cycle[current.direction];
};

const sortStockData = (data: StockData[], config: SortConfig | null): StockData[] => {
  if (!config || config.direction === 'none') return data;

  const { column, direction } = config;
  const modifier = direction === 'desc' ? -1 : 1;

  return data.toSorted((a, b) => {
    const aVal = a[column];
    const bVal = b[column];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return modifier * aVal.localeCompare(bVal);
    }
    return modifier * ((aVal as number) - (bVal as number));
  });
};

// ============================================================================
// Hook Implementation
// ============================================================================

export function useStockSubscription(
  options: UseStockSubscriptionOptions = {}
): UseStockSubscriptionReturn {
  const {
    defaultSort = { column: 'timestamp', direction: 'desc' },
    onError,
    onConnect,
  } = options;

  // -------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------
  
  /** Render trigger - incremented on each stock update */
  const [tickCount, setTickCount] = useState(0);
  
  /** Current subscription mode */
  const [mode, setMode] = useState<SubscriptionMode>('none');
  
  /** Currently subscribed ticker (for single mode) */
  const [subscribedTicker, setSubscribedTicker] = useState<string | null>(null);
  
  /** Error message */
  const [error, setError] = useState<string | null>(null);
  
  /** Sort configuration */
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSort);

  // -------------------------------------------------------------------------
  // Refs (mutable state that doesn't trigger re-renders)
  // -------------------------------------------------------------------------
  
  /** O(1) lookup map - kept outside React state to avoid copy overhead */
  const stockMapRef = useRef<Map<string, StockData>>(new Map());
  
  /** Current unsubscribe function */
  const unsubscribeRef = useRef<(() => void) | null>(null);
  
  /** Last successfully connected ticker (for error recovery) */
  const lastWorkingTickerRef = useRef<string | null>(null);

  // -------------------------------------------------------------------------
  // Derived State
  // -------------------------------------------------------------------------
  
  const isConnected = mode !== 'none';

  const status: ConnectionStatus = useMemo(() => {
    if (mode === 'none') return { state: 'disconnected' };
    if (mode === 'all') return { state: 'connected', mode: 'all' };
    return { state: 'connected', mode: 'single', ticker: subscribedTicker! };
  }, [mode, subscribedTicker]);

  const data = useMemo(() => {
    const dataArray = [...stockMapRef.current.values()];
    return sortStockData(dataArray, sortConfig);
    // tickCount dependency ensures re-computation on stock updates
  }, [tickCount, sortConfig]);

  // -------------------------------------------------------------------------
  // Internal Handlers
  // -------------------------------------------------------------------------
  
  /** Clean up subscription without changing state */
  const cleanup = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    stockMapRef.current.clear();
  }, []);

  /** Handle incoming stock data */
  const handleStockUpdate = useCallback((stock: StockData) => {
    stockMapRef.current.set(stock.ticker, stock);
    setTickCount(c => c + 1);
  }, []);

  /** Handle subscription errors with recovery */
  const handleSubscriptionError = useCallback((err: Error) => {
    const failedTicker = subscribedTicker;
    const errorMessage = `Failed to subscribe to "${failedTicker}": ${err.message || 'Unknown error'}`;
    
    setError(errorMessage);
    onError?.(err, failedTicker || '');

    // Attempt recovery: restore previous working ticker
    if (lastWorkingTickerRef.current && lastWorkingTickerRef.current !== subscribedTicker) {
      setSubscribedTicker(lastWorkingTickerRef.current);
    } else {
      // No recovery possible - disconnect
      cleanup();
      setMode('none');
      setSubscribedTicker(null);
    }
  }, [subscribedTicker, cleanup, onError]);

  // -------------------------------------------------------------------------
  // Subscription Effect
  // -------------------------------------------------------------------------
  
  useEffect(() => {
    if (mode === 'none') return;

    if (mode === 'all') {
      unsubscribeRef.current = subscribeAllStocks((data) => {
        lastWorkingTickerRef.current = null;
        setError(null);
        handleStockUpdate(data);
      });
      onConnect?.('all');
      return cleanup;
    }

    if (mode === 'single' && subscribedTicker) {
      unsubscribeRef.current = subscribeStock(
        subscribedTicker,
        (data) => {
          // Mark as working on first successful data
          if (lastWorkingTickerRef.current !== subscribedTicker) {
            lastWorkingTickerRef.current = subscribedTicker;
            onConnect?.('single', subscribedTicker);
          }
          setError(null);
          handleStockUpdate(data);
        },
        handleSubscriptionError
      );
      return cleanup;
    }
  }, [mode, subscribedTicker, cleanup, handleStockUpdate, handleSubscriptionError, onConnect]);

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------
  
  const subscribeAll = useCallback(() => {
    cleanup();
    setSubscribedTicker(null);
    setError(null);
    setMode('all');
  }, [cleanup]);

  const subscribeSingle = useCallback((ticker: string) => {
    const normalizedTicker = ticker.trim().toUpperCase();
    
    if (!normalizedTicker) {
      setError('Please enter a valid ticker symbol');
      return;
    }

    cleanup();
    setSubscribedTicker(normalizedTicker);
    setMode('single');
  }, [cleanup]);

  const unsubscribe = useCallback(() => {
    cleanup();
    setMode('none');
    setSubscribedTicker(null);
    lastWorkingTickerRef.current = null;
    setError(null);
  }, [cleanup]);

  const clearError = useCallback(() => setError(null), []);

  const handleColumnSort = useCallback((column: keyof StockData) => {
    setSortConfig(prev => ({
      column,
      direction: prev ? getNextSortDirection(prev, column) : 'desc',
    }));
  }, []);

  // -------------------------------------------------------------------------
  // Return
  // -------------------------------------------------------------------------
  
  return {
    data,
    status,
    isConnected,
    error,
    sortConfig,
    subscribeAll,
    subscribeSingle,
    unsubscribe,
    clearError,
    setSortConfig,
    handleColumnSort,
    tickCount,
  };
}
