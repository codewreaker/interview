# File Explorer - Solution Reference

This document contains the complete solution for the recursive file explorer interview question.

## Overview

The key concept being tested is **recursion in React components**. A TreeNode component renders itself for each child node, creating a recursive rendering pattern.

## Solution Architecture

```
FileExplorer (state management)
└── TreeNode (recursive rendering)
    └── TreeNode
        └── TreeNode
            └── ...
```

## Complete Solution

### TreeNode.tsx (Solution)

```tsx
import React, { memo } from 'react';
import type { FileNode, TreeNodeProps } from './types';

export const TreeNode: React.FC<TreeNodeProps> = memo(({
  node,
  depth,
  path,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
}) => {
  const isFolder = node.type === 'folder';
  const isExpanded = expandedIds.has(node.id);
  const isSelected = selectedId === node.id;

  const handleClick = () => {
    // Toggle folder if it's a folder
    if (isFolder) {
      onToggle(node.id);
    }
    // Always select the node
    onSelect(node, path);
  };

  return (
    <div role="treeitem" aria-expanded={isFolder ? isExpanded : undefined}>
      <div
        className={`tree-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${depth * 16}px` }}
        onClick={handleClick}
      >
        {/* Chevron for folders */}
        {isFolder && (
          <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>
            ▶
          </span>
        )}

        {/* Icon */}
        <span className="tree-item-icon">
          {isFolder ? (isExpanded ? '📂' : '📁') : '📄'}
        </span>

        {/* Name */}
        <span className="tree-item-name">{node.name}</span>
      </div>

      {/* Recursive children */}
      {isFolder && isExpanded && node.children && (
        <div className="tree-children" role="group">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              path={`${path}/${child.name}`}
              expandedIds={expandedIds}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = 'TreeNode';
```

### FileExplorer.tsx (Solution)

```tsx
import React, { useState, useCallback, useMemo } from 'react';
import type { FileNode, FileExplorerProps } from './types';
import { TreeNode } from './TreeNode';
import { getAllFolderIds, filterNodes } from './mockData';

export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  data, 
  onSelect 
}) => {
  // State for tracking which folders are expanded
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // State for tracking which item is selected
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Toggle folder expansion
  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // Handle item selection
  const handleSelect = useCallback((node: FileNode, path: string) => {
    setSelectedId(node.id);
    onSelect?.(node, path);
  }, [onSelect]);

  // Expand all folders
  const handleExpandAll = useCallback(() => {
    const allFolderIds = getAllFolderIds(data);
    setExpandedIds(new Set(allFolderIds));
  }, [data]);

  // Collapse all folders
  const handleCollapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  return (
    <div>
      {/* Toolbar */}
      <div style={{ marginBottom: '10px', display: 'flex', gap: '8px' }}>
        <button 
          onClick={handleExpandAll}
          style={{
            padding: '4px 8px',
            background: '#45475a',
            border: 'none',
            borderRadius: '4px',
            color: '#cdd6f4',
            cursor: 'pointer',
          }}
        >
          Expand All
        </button>
        <button 
          onClick={handleCollapseAll}
          style={{
            padding: '4px 8px',
            background: '#45475a',
            border: 'none',
            borderRadius: '4px',
            color: '#cdd6f4',
            cursor: 'pointer',
          }}
        >
          Collapse All
        </button>
      </div>

      {/* Tree */}
      <div role="tree" aria-label="File explorer">
        {data.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            path={node.name}
            expandedIds={expandedIds}
            selectedId={selectedId}
            onToggle={handleToggle}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// BONUS: Searchable File Explorer
// ============================================================================

export const SearchableFileExplorer: React.FC<FileExplorerProps> = ({
  data,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter data based on search query
  const filteredData = useMemo(
    () => filterNodes(data, searchQuery),
    [data, searchQuery]
  );

  // Auto-expand all when searching
  const effectiveExpandedIds = useMemo(() => {
    if (searchQuery.trim()) {
      return new Set(getAllFolderIds(filteredData));
    }
    return expandedIds;
  }, [searchQuery, filteredData, expandedIds]);

  const handleToggle = useCallback((id: string) => {
    if (searchQuery.trim()) return; // Don't allow toggle during search
    
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, [searchQuery]);

  const handleSelect = useCallback((node: FileNode, path: string) => {
    setSelectedId(node.id);
    onSelect?.(node, path);
  }, [onSelect]);

  return (
    <div>
      <input
        type="text"
        className="search-box"
        placeholder="Search files..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      <div role="tree" aria-label="File explorer">
        {filteredData.length === 0 ? (
          <p style={{ color: '#6c7086', padding: '20px', textAlign: 'center' }}>
            No files match "{searchQuery}"
          </p>
        ) : (
          filteredData.map(node => (
            <TreeNode
              key={node.id}
              node={node}
              depth={0}
              path={node.name}
              expandedIds={effectiveExpandedIds}
              selectedId={selectedId}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};
```

## Key Concepts Explained

### 1. Recursion Pattern

The TreeNode component calls itself for each child:

```tsx
{node.children?.map(child => (
  <TreeNode
    key={child.id}
    node={child}
    depth={depth + 1}  // Increment depth
    path={`${path}/${child.name}`}  // Build path
    // ... other props
  />
))}
```

**Base case**: When a node has no children or is a file, the recursion stops naturally.

### 2. State Lifting

State is managed at the top (FileExplorer) and passed down:
- `expandedIds`: Set of expanded folder IDs
- `selectedId`: ID of selected item

This allows sibling nodes to know about each other's state.

### 3. Set for O(1) Lookups

Using `Set<string>` for expandedIds provides O(1) lookup:

```tsx
const isExpanded = expandedIds.has(node.id);  // O(1)
```

### 4. Path Building

Path is built incrementally as we recurse:

```tsx
// Root level
path={node.name}  // "src"

// Child level
path={`${path}/${child.name}`}  // "src/components"
```

### 5. Performance with memo

Using `React.memo` prevents unnecessary re-renders:

```tsx
export const TreeNode: React.FC<TreeNodeProps> = memo(({ ... }) => {
  // Component only re-renders when props actually change
});
```

## Testing Strategy

1. **Render tests**: Verify files and folders render correctly
2. **Expand/collapse tests**: Verify toggle behavior
3. **Selection tests**: Verify selection state and callbacks
4. **Deep nesting tests**: Verify recursion handles 5+ levels
5. **Path tests**: Verify correct paths are generated

## Common Mistakes to Avoid

1. **Forgetting the key prop**: Each TreeNode needs a unique key
2. **Mutating state directly**: Use `new Set(prev)` to create new Set
3. **Missing base case**: Ensure recursion stops for files
4. **Path building errors**: Watch for leading/trailing slashes
5. **Performance issues**: Memoize callbacks and components

## Time Complexity

- **Render**: O(n) where n is number of visible nodes
- **Toggle**: O(1) for Set operations
- **Select**: O(1)
- **Search/Filter**: O(n) for filtering, O(m) for rendering results

## Accessibility Considerations

1. Use `role="tree"` on container
2. Use `role="treeitem"` on each node
3. Use `role="group"` for children container
4. Set `aria-expanded` for folders
5. Support keyboard navigation (bonus)

## Extension Ideas

1. **Virtualization**: For very large trees, use react-window
2. **Drag & Drop**: Use react-dnd for reordering
3. **Context Menu**: Right-click for actions
4. **Lazy Loading**: Fetch children on expand
5. **Multi-select**: Hold Ctrl/Cmd to select multiple
