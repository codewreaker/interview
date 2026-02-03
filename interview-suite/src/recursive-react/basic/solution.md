# Basic File Explorer - Solution

## The Simplest Solution (~20 lines)

```tsx
import React, { useState } from 'react';
import type { FileNode } from './types';

interface FileExplorerProps {
  data: FileNode[];
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ data }) => {
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    setOpenFolders(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const renderNode = (node: FileNode, level: number = 0): JSX.Element => {
    const isFolder = node.type === 'folder';
    const isOpen = openFolders.has(node.name);

    return (
      <div key={node.name}>
        <div
          style={{ marginLeft: level * 20, cursor: isFolder ? 'pointer' : 'default', padding: '4px' }}
          onClick={() => isFolder && toggle(node.name)}
        >
          {isFolder ? (isOpen ? '📂' : '📁') : '📄'} {node.name}
        </div>
        {isFolder && isOpen && node.children?.map(child => renderNode(child, level + 1))}
      </div>
    );
  };

  return <div>{data.map(node => renderNode(node))}</div>;
};
```

## How It Works

### 1. State Management
```tsx
const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
```
We use a Set to track which folder names are "open". A Set gives us O(1) lookup.

### 2. Toggle Function
```tsx
const toggle = (name: string) => {
  setOpenFolders(prev => {
    const next = new Set(prev);
    next.has(name) ? next.delete(name) : next.add(name);
    return next;
  });
};
```
If folder is in the Set, remove it. If not, add it.

### 3. Recursive Rendering
```tsx
const renderNode = (node: FileNode, level: number = 0): JSX.Element => {
  // ... render this node
  // ... if it's an open folder, render children:
  {isFolder && isOpen && node.children?.map(child => renderNode(child, level + 1))}
};
```
The function calls itself for each child - that's recursion!

### 4. Indentation
```tsx
style={{ marginLeft: level * 20 }}
```
Each level adds 20px of left margin.

## Key Concepts

| Concept | What it means |
|---------|---------------|
| **Recursion** | A function/component that calls itself |
| **Base case** | Files have no children, so recursion stops |
| **State lifting** | Open/closed state managed at the top level |

## Common Mistakes

1. **Forgetting the key prop** - Each element in a list needs a unique key
2. **Mutating the Set directly** - Always create a new Set: `new Set(prev)`
3. **Not stopping recursion** - Files don't have children, so we check `isFolder && isOpen`
