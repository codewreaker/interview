import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { subscribeAllStocks, subscribeStock, type StockData } from './stockApi';

/**
 * INTERVIEW TASKS:
 * 
 * 1. Subscribe to all stocks and display them in a table
 * 2. Sort the data by timestamp (most recent first)
 * 3. Use a data structure (Map) to persist data and update in real-time
 * 4. Add ability to subscribe to a single stock via input
 * 5. Implement sortable columns (click headers to sort)
 * 6. Add unsubscribe functionality
 * 
 * APIs Available:
 * - subscribeAllStocks(callback) -> returns unsubscribe function
 * - subscribeStock(ticker, callback) -> returns unsubscribe function
 * 
 * StockData shape: { ticker, price, change, changePercent, timestamp }
 */
interface TickerData { ticker: string, price: number, change: number, changePercent: number, timestamp: number }

type SubscriptionMode = 'none' | 'all' | 'single';
type SortKey = keyof TickerData;
type SortDirection = 'asc' | 'desc';

const HEADERS: { key: SortKey; label: string }[] = [
    { key: 'ticker', label: 'Ticker' },
    { key: 'price', label: 'Price' },
    { key: 'change', label: 'Change' },
    { key: 'changePercent', label: 'Change %' },
    { key: 'timestamp', label: 'Time' },
];

const formatDateTime = (timestamp: number) => new Date(timestamp).toUTCString();

const formatValue = (key: SortKey, value: number | string) => {
    if (key === 'timestamp') return formatDateTime(value as number);
    if (key === 'price') return `$${(value as number).toFixed(2)}`;
    if (key === 'changePercent') return `${(value as number).toFixed(2)}%`;
    if (key === 'change') return (value as number).toFixed(2);
    return value;
};

// Use Map ref for O(1) mutations - not in state to avoid copying
const tickerMap:Map<string, TickerData> = new Map();

function App() {
    // Counter to trigger re-renders when map updates
    const [renderCount, forceRender] = useState(0);
    // Separate key to force re-subscription (not tied to data updates)
    const [subscriptionKey, setSubscriptionKey] = useState(0);
    const [subscriptionMode, setSubscriptionMode] = useState<SubscriptionMode>('none');
    const [tickerInput, setTickerInput] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
        key: 'timestamp',
        direction: 'desc',
    });

    // Single ref for cleanup function
    const unsubscribeRef = useRef<(() => void) | null>(null);

    // True O(1) update - mutate Map directly, then trigger render
    const updateMap = useCallback((data: TickerData) => {
        tickerMap.set(data.ticker, data);
        forceRender(n => n + 1);
    }, []);

    // Cleanup current subscription (imperative, no state change)
    const cleanupSubscription = useCallback(() => {
        unsubscribeRef.current?.();
        unsubscribeRef.current = null;
        tickerMap.clear();
    }, []);

    // Full unsubscribe (cleanup + reset state)
    const unsubscribe = useCallback(() => {
        cleanupSubscription();
        setSubscriptionMode('none');
        forceRender(0);
    }, [cleanupSubscription]);

    // Subscribe to all stocks
    const subscribeAll = useCallback(() => {
        cleanupSubscription();
        setSubscriptionKey(k => k + 1); // Force effect re-run
        setSubscriptionMode('all');
    }, [cleanupSubscription]);

    // Subscribe to single stock
    const subscribeSingle = useCallback(() => {
        const ticker = tickerInput.trim().toUpperCase();
        if (!ticker) {
            console.warn('Please enter a ticker symbol');
            return;
        }
        cleanupSubscription();
        setTickerInput(ticker);
        setSubscriptionKey(k => k + 1); // Force effect re-run
        setSubscriptionMode('single');
    }, [tickerInput, cleanupSubscription]);

    // Handle input change - don't unsubscribe on every keystroke
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTickerInput(e.target.value.toUpperCase());
    }, []);

    // Handle column sort
    const handleSort = useCallback((key: SortKey) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
        }));
    }, []);

    // Subscription effect - single source of truth
    useEffect(() => {
        if (subscriptionMode === 'none') return;

        const unsub = subscriptionMode === 'all'
            ? subscribeAllStocks(updateMap)
            : subscribeStock(tickerInput, updateMap);

        unsubscribeRef.current = unsub;

        return () => {
            unsub();
            unsubscribeRef.current = null;
        };
    }, [subscriptionMode, tickerInput, updateMap, subscriptionKey]); // subscriptionKey allows re-subscribe on double-click

    // Memoized sorted data - reads from ref
    const sortedData = useMemo(() => {
        const data = Array.from(tickerMap.values());
        const { key, direction } = sortConfig;
        const multiplier = direction === 'desc' ? -1 : 1;

        return data.sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            if (typeof aVal === 'string') return multiplier * aVal.localeCompare(bVal as string);
            return multiplier * ((aVal as number) - (bVal as number));
        });
    }, [renderCount, sortConfig]); // renderCount triggers recalc when map mutates

    const isConnected = subscriptionMode !== 'none';

    return (
        <div className="container">
            <h1>📈 Real-Time Stock Ticker</h1>

            {/* Instructions - You can remove this later */}
            <div className="instructions">
                <h3>Tasks:</h3>
                <ul>
                    <li><strong>Task 1:</strong> Subscribe to all stocks and display in table ✅</li>
                    <li><strong>Task 2:</strong> Sort by timestamp (most recent first) ✅</li>
                    <li><strong>Task 3:</strong> Use Map for O(1) updates ✅</li>
                    <li><strong>Task 4:</strong> Subscribe to single stock via input ✅</li>
                    <li><strong>Task 5:</strong> Sortable columns (click headers) ✅</li>
                    <li><strong>Task 6:</strong> Unsubscribe functionality ✅</li>
                </ul>
            </div>

            {/* Controls */}
            <div className="controls">
                <div className="control-group">
                    <input
                        type="text"
                        placeholder="Enter ticker (e.g., AAPL)"
                        onChange={handleInputChange}
                        value={tickerInput}
                    />
                    <button className="btn-primary" onClick={subscribeSingle}>
                        Subscribe Stock
                    </button>
                </div>
                <div className="control-group">
                    <button className="btn-secondary" onClick={subscribeAll}>
                        Subscribe All
                    </button>
                    <button className="btn-danger" onClick={unsubscribe}>
                        Unsubscribe All
                    </button>
                </div>
                <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? `Connected (${subscriptionMode === 'all' ? 'All' : tickerInput})` : 'Disconnected'}
                </span>
            </div>

            <table>
                <thead>
                    <tr>
                        {HEADERS.map(({ key, label }) => (
                            <th
                                key={key}
                                onClick={() => handleSort(key)}
                                style={{ cursor: 'pointer' }}
                            >
                                {label}
                                {sortConfig.key === key && (
                                    <span>{sortConfig.direction === 'desc' ? ' ↓' : ' ↑'}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.length === 0 ? (
                        <tr>
                            <td colSpan={HEADERS.length}>
                                <div className="empty-state">
                                    <h3>No Data</h3>
                                    <p>Subscribe to stocks to see real-time data</p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        sortedData.map((row) => (
                            <tr key={row.ticker} className={row.change >= 0 ? 'positive' : 'negative'}>
                                {HEADERS.map(({ key }) => (
                                    <td key={key}>{formatValue(key, row[key])}</td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

// Render
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
