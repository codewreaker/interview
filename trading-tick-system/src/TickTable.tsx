import React from 'react';
import type { TickData } from './types';

interface TickTableProps {
  ticks: TickData[];
}

export const TickTable: React.FC<TickTableProps> = ({ ticks }) => {
  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    }}>
      <thead>
        <tr style={{
          backgroundColor: '#f0f0f0',
          borderBottom: '2px solid #333',
        }}>
          <th style={headerStyle}>Symbol</th>
          <th style={headerStyle}>Price</th>
          <th style={headerStyle}>Bid</th>
          <th style={headerStyle}>Ask</th>
          <th style={headerStyle}>Change</th>
          <th style={headerStyle}>Change %</th>
          <th style={headerStyle}>Volume</th>
          <th style={headerStyle}>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {ticks.map((tick) => (
          <tr
            key={`${tick.symbol}-${tick.timestamp}`}
            style={{
              borderBottom: '1px solid #ddd',
              backgroundColor: tick.change >= 0 ? '#f0fff0' : '#fff0f0',
            }}
          >
            <td style={cellStyle}>{tick.symbol}</td>
            <td style={cellStyle}>${tick.price.toFixed(2)}</td>
            <td style={cellStyle}>${tick.bid.toFixed(2)}</td>
            <td style={cellStyle}>${tick.ask.toFixed(2)}</td>
            <td style={{
              ...cellStyle,
              color: tick.change >= 0 ? 'green' : 'red',
              fontWeight: 'bold',
            }}>
              {tick.change >= 0 ? '+' : ''}{tick.change.toFixed(2)}
            </td>
            <td style={{
              ...cellStyle,
              color: tick.changePercent >= 0 ? 'green' : 'red',
              fontWeight: 'bold',
            }}>
              {tick.changePercent >= 0 ? '+' : ''}{tick.changePercent.toFixed(2)}%
            </td>
            <td style={cellStyle}>{tick.volume.toLocaleString()}</td>
            <td style={cellStyle}>{new Date(tick.timestamp).toLocaleTimeString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const headerStyle: React.CSSProperties = {
  padding: '10px',
  textAlign: 'left',
  fontWeight: 'bold',
};

const cellStyle: React.CSSProperties = {
  padding: '8px 10px',
  textAlign: 'right',
};
