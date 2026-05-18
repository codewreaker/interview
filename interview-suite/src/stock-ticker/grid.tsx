import React from 'react';
import { StockData } from './stockApi';
import { SortConfig } from './useStockSubscription';

const HEADERS: Record<keyof StockData, {
    label:string
}> = {
    ticker: {
        label: 'Ticker'
    },
    price: {
        label: 'price'
    },
    change: {
        label: 'delta'
    },
    changePercent: {
        label: '%'
    },
    timestamp: {
        label: 'time'
    }
}

export const Grid: React.FC<{
    handleColumnSort: (column: keyof StockData) => void;
    data: StockData[];
    sortConfig: SortConfig
}> = ({
    data,
    handleColumnSort,
    sortConfig
}) => {
        const headers = Object.keys(HEADERS) as Array<keyof StockData>;
        return (
            <table>
                <thead>
                    <tr>{headers.map((h) => <th>{h}</th>)}</tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr>
                            {headers.map((key) => (
                                <td className={`${key} ${row.change >= 0 ? 'positive' : 'negative'}`}>{row[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }
