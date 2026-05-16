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
