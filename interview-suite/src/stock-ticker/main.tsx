import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { subscribeAllStocks, subscribeStock, type StockData } from './stockApi';
import { Grid, SortConfig } from './grid';

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


// Use Map ref for O(1) mutations - not in state to avoid copying
const tickerMap: Map<string, StockData> = new Map();

const newDirection=( prev:SortConfig)=>{
    if(prev.direction === 'desc') return 'none';
    if(prev.direction === 'asc') return 'desc';
    if(prev.direction === 'none') return 'asc'
    return newDirection(prev)
}

function App() {
    // Counter to trigger re-renders when map updates
    const [tickCount, tick] = useState<number>(0);
    const [tickerInput, setTickerInput] = useState('');
    const [subMode, setSubmode] = useState<'single' | 'all' | 'none'>('all');
    const [sortConfig, setSortConfig] = useState<SortConfig | null>({
        column: 'timestamp',
        direction: 'desc'
    })
    const isConnected = useMemo(() => false, [])

    useEffect(() => {
        if (subMode === 'all') {
            return subscribeAllStocks(updateMap)
        }

        if (subMode === 'single') {
            return subscribeStock('AAPL', updateMap, console.error)
        }

        //return unsub

    }, [subMode]);

    const updateMap = (stockData: StockData) => {
        tickerMap.set(stockData.ticker, stockData);
        tick(prev => prev + 1);
    }

    const columnClicked = (col: keyof StockData) => {
        setSortConfig(prev=>({
            column: col,
            direction: prev?.column === col ? newDirection(prev): 'desc'
        }))


    }

    // Handle input change - don't unsubscribe on every keystroke
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setTickerInput(e.target.value.toUpperCase());
    }, []);


    const data = useMemo(() => {
        const dataArray = [...tickerMap.values()];
        if (sortConfig) {
            return dataArray.toSorted((a, b) => {
                const key = sortConfig.column;
                let aVal: string | number = a[key];
                let bVal: string | number  = b[key];
                let modifier = 0;

                if (sortConfig.direction === "desc") { modifier = -1 }
                if (sortConfig.direction === "asc") { modifier = 1 }

                if (typeof aVal === "string") {
                    aVal = aVal.toLocaleLowerCase();
                    bVal = (bVal as string).toLocaleLowerCase();
                    return (modifier >=0) ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                }

                return aVal > (bVal as number) ? modifier : -modifier;
            })
        }
        return dataArray;
    }, [tickCount, sortConfig]);


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
                    <button className="btn-primary">
                        Sub Stock
                    </button>
                </div>
                <div className="control-group">
                    <button className="btn-secondary">
                        Sub All
                    </button>
                    <button className="btn-danger">
                        Unsub All
                    </button>
                </div>
                <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? `Connected (${subscriptionMode === 'all' ? 'All' : tickerInput})` : 'Disconnected'}
                </span>
            </div>
            <Grid data={data} onColumnClicked={columnClicked} sortConfig={sortConfig} />
        </div>
    );
}

// Render
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
