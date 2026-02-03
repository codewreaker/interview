
import React from 'react';
import { type StockData } from './stockApi';

export type SortKey = keyof StockData;
export type SortConfig = { column: SortKey, direction: 'asc' | 'desc' | 'none' }

const formatDateTime = (timestamp: number) => new Date(timestamp).toUTCString();
const formatRow=(key:keyof StockData, row:StockData[keyof StockData])=>{
    if(key === "timestamp") return formatDateTime(row as number);
    return row;
}


const HEADERS: { key: SortKey; label: string }[] = [
    { key: 'ticker', label: 'Ticker' },
    { key: 'price', label: 'Price' },
    { key: 'change', label: 'Change' },
    { key: 'changePercent', label: 'Change %' },
    { key: 'timestamp', label: 'Time' },
];

const Empty = ({ length }: { length: number }) => (<tr>
    <td colSpan={length}>
        <div className="empty-state">
            <h3>No Data</h3>
            <p>Subscribe to stocks to see real-time data</p>
        </div>
    </td>
</tr>)

export const Grid: React.FC<{
    data: StockData[];
    sortConfig: SortConfig | null;
    onColumnClicked?: (column:string)=>void;
}> = ({ data, sortConfig, onColumnClicked
 }) => {
    console.log(data)
    return (
        <table>
            <thead>
                <tr>
                    {HEADERS.map(({ key, label }) => (
                        <th
                            key={key}
                            onClick={() => onColumnClicked?.(key)}
                            style={{ cursor: 'pointer' }}
                            className={sortConfig?.column === key ? `sorted-${sortConfig?.direction}` : ''}
                        >
                            {label}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length === 0 ? (
                    <Empty length={HEADERS.length} />
                ) : (data.map((row) => (
                    <tr key={row.ticker}>
                        {HEADERS.map(({ key, label }) => (
                            <td className={`${key} ${row.change >= 0 ? 'positive' : 'negative'}`} >{formatRow(key,row[key])}</td>
                        ))}
                    </tr>
                )))}
            </tbody>
        </table >
    )
}