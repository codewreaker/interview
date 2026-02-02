import React, { useState, useEffect, useRef, useCallback } from 'react';
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

function App() {
    // TODO: Implement your state here
    // Hint: Use Map for O(1) lookups by ticker

    return (
        <div className="container">
            <h1>📈 Real-Time Stock Ticker</h1>

            {/* Instructions - You can remove this later */}
            <div className="instructions">
                <h2>📋 Interview Question</h2>
                <h3>Available APIs:</h3>
                <pre><code>{`import { subscribeAllStocks, subscribeStock } from './stockApi';

const unsubscribe = subscribeAllStocks((stockData) => { ... });
const unsubscribe = subscribeStock('AAPL', (stockData) => { ... });

// stockData: { ticker, price, change, changePercent, timestamp }`}</code></pre>
                <h3>Tasks:</h3>
                <ul>
                    <li><strong>Task 1:</strong> Subscribe to all stocks and display in table</li>
                    <li><strong>Task 2:</strong> Sort by timestamp (most recent first)</li>
                    <li><strong>Task 3:</strong> Use Map for O(1) updates (avoid flashing)</li>
                    <li><strong>Task 4:</strong> Subscribe to single stock via input</li>
                    <li><strong>Task 5:</strong> Sortable columns (click headers)</li>
                    <li><strong>Task 6:</strong> Unsubscribe functionality</li>
                </ul>
            </div>

            {/* TODO: Implement Controls */}
            <div className="controls">
                <div className="control-group">
                    <input type="text" placeholder="Enter ticker (e.g., AAPL)" />
                    <button className="btn-primary">Subscribe Stock</button>
                </div>
                <div className="control-group">
                    <button className="btn-secondary">Subscribe All</button>
                    <button className="btn-danger">Unsubscribe All</button>
                </div>
                <span className="status disconnected">Disconnected</span>
            </div>

            {/* TODO: Implement Table */}
            {/* <td colSpan={5}>
                <div className="empty-state">
                  <h3>No Data</h3>
                  <p>Subscribe to stocks to see real-time data</p>
                </div>
              </td> */}
            <div className="table-container">
                {/**Implement table here */}
            </div>
        </div>
    );
}

// Render
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
