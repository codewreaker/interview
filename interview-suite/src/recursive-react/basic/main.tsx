import React, { useCallback, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FileExplorer } from './FileExplorer';
import { simpleFileTree } from './data';
import { FileNode } from './types';

const findFiles = (tree: FileNode[], searchStr: string): FileNode[] => {
  if (!searchStr) return tree;

  const lowerSearch = searchStr.toLowerCase();
  const result: FileNode[] = [];

  for (const entry of tree) {
    const matches = entry.name.toLowerCase().includes(lowerSearch);
    const childMatches = entry.children
      ? findFiles(entry.children, searchStr)
      : [];

    // Include if node matches OR has matching descendants
    if (matches || childMatches.length > 0) {
      result.push({
        ...entry,
        // If parent matches, keep all children; otherwise use filtered children
        children: matches ? entry.children : childMatches
      });
    }
  }

  return result;
}

// implementing a debounce for the search
const debounce = <T extends (...args: any) => any>(callback: T, delay: number = 500, immediate = false) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: Parameters<T>) {
    (timeoutId !== null) && clearTimeout(timeoutId);

    if (immediate && timeoutId === null) {
      callback.apply(this, args)
    }

    timeoutId = setTimeout(() => {
      if (!immediate) {
        callback.apply(this, args);
      }
      timeoutId = null;
    }, delay)
  }
}


const App: React.FC = () => {
  const [searchStr, setSearchStr] = useState<string>('');

  const [data, isSearching] = useMemo(() => [
    findFiles(simpleFileTree, searchStr),
    Boolean(searchStr)
  ], [searchStr])

  const onSearch = debounce(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStr(value);
  }, 500)


  return (
    <div>
      <div className='search-box'>
        <label htmlFor='search-input'> Search Files</label>
        <input id='search-input' type='search' onChange={onSearch} />
      </div>
      {data.length === 0 && isSearching ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#6c7086' }}>
          No files found matching "{searchStr}"
        </div>
      ) : (
        <FileExplorer data={data} isSearching={isSearching} />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-evenly', height: '100%' }}>
        <div style={{ padding: 5, border: '1px solid #6867678d', margin: '20px 0px', borderRadius: 5 }}>
          <div style={{ padding: 5, color: '#89b4fa' }}>Original</div>
          <pre style={{ margin: 0, overflow: 'auto' }}>{JSON.stringify(simpleFileTree, null, 2)}</pre>
        </div>

        <div style={{ padding: 5, height: '100%', border: '1px solid #6867678d', margin: '20px 0px', borderRadius: 5 }}>
          <div style={{ padding: 5, color: '#89b4fa' }}>
            Search: {searchStr || '(showing all files)'}
          </div>
          <pre style={{ margin: 0, overflow: 'auto' }}>{JSON.stringify(data, null, 2)}</pre>
        </div>

      </div>

    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
