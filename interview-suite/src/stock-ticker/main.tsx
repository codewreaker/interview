import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Grid } from './grid';
import { useStockSubscription } from './useStockSubscription';

// ============================================================================
// Subcomponents
// ============================================================================

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onDismiss }) => (
  <div
    className="error-banner"
    role="alert"
    style={{
      backgroundColor: '#fee2e2',
      border: '1px solid #ef4444',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <span>⚠️ {message}</span>
    <button
      onClick={onDismiss}
      aria-label="Dismiss error"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        color: '#dc2626',
      }}
    >
      ✕
    </button>
  </div>
);

interface ConnectionStatusProps {
  isConnected: boolean;
  mode: 'all' | 'single' | 'none';
  ticker?: string | null;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected, mode, ticker }) => {
  const label = isConnected
    ? `Connected (${mode === 'all' ? 'All Stocks' : ticker})`
    : 'Disconnected';

  return (
    <span className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
      {label}
    </span>
  );
};

// ============================================================================
// Main App Component
// ============================================================================

function App() {
  // Local UI state
  const [tickerInput, setTickerInput] = useState('');

  // All subscription logic encapsulated in hook
  const {
    data,
    status,
    isConnected,
    error,
    sortConfig,
    subscribeAll,
    subscribeSingle,
    unsubscribe,
    clearError,
    handleColumnSort,
  } = useStockSubscription({
    defaultSort: { column: 'timestamp', direction: 'desc' },
  });

  // Handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTickerInput(e.target.value.toUpperCase());
  }, []);

  const handleSubscribeSingle = useCallback(() => {
    if (!tickerInput.trim()) {
      alert('Please enter a ticker symbol');
      return;
    }
    subscribeSingle(tickerInput);
  }, [tickerInput, subscribeSingle]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubscribeSingle();
    }
  }, [handleSubscribeSingle]);

  // Derive mode for status display
  const displayMode = status.state === 'disconnected' ? 'none' : status.mode;
  const displayTicker = status.state === 'connected' && status.mode === 'single' 
    ? status.ticker 
    : null;

  return (
    <div className="container">
      <h1>📈 Real-Time Stock Ticker</h1>

      {/* Controls */}
      <div className="controls">
        <div className="control-group">
          <input
            type="text"
            placeholder="Enter ticker (e.g., AAPL)"
            value={tickerInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            aria-label="Stock ticker symbol"
          />
          <button className="btn-primary" onClick={handleSubscribeSingle}>
            Subscribe
          </button>
        </div>
        <div className="control-group">
          <button className="btn-secondary" onClick={subscribeAll}>
            All Stocks
          </button>
          <button 
            className="btn-danger" 
            onClick={unsubscribe}
            disabled={!isConnected}
          >
            Disconnect
          </button>
        </div>
        <ConnectionStatus
          isConnected={isConnected}
          mode={displayMode}
          ticker={displayTicker}
        />
      </div>

      {/* Error Display */}
      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {/* Data Grid */}
      <Grid
        data={data}
        sortConfig={sortConfig}
        onColumnClicked={handleColumnSort}
      />
    </div>
  );
}

// ============================================================================
// Render
// ============================================================================

const root = createRoot(document.getElementById('root')!);
root.render(<App />);

