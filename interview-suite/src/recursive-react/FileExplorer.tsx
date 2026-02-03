import React, { useState, useCallback, useMemo } from 'react';
import type { FileNode, FileExplorerProps } from './types';
import { TreeNode } from './TreeNode';
import { countNodes, getAllFolderIds } from './mockData';

/**
 * FileExplorer Component - IMPLEMENT THIS
 * 
 * This is the main container component that manages the state
 * and renders the tree structure.
 * 
 * Requirements:
 * 1. Manage expanded state (which folders are open)
 * 2. Manage selected state (which item is selected)
 * 3. Provide toggle/select callbacks to TreeNode
 * 4. Optionally: Add search filtering
 * 5. Optionally: Add expand all / collapse all buttons
 * 
 * State to manage:
 * - expandedIds: Set<string> - IDs of expanded folders
 * - selectedId: string | null - ID of selected node
 * - selectedPath: string | null - Path of selected node
 */
export const FileExplorer: React.FC<FileExplorerProps> = ({ 
  data, 
  onSelect 
}) => {
  // TODO: Implement state management
  // const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  // const [selectedId, setSelectedId] = useState<string | null>(null);

  // TODO: Implement toggle handler
  // const handleToggle = useCallback((id: string) => {
  //   setExpandedIds(prev => {
  //     const next = new Set(prev);
  //     if (next.has(id)) next.delete(id);
  //     else next.add(id);
  //     return next;
  //   });
  // }, []);

  // TODO: Implement select handler
  // const handleSelect = useCallback((node: FileNode, path: string) => {
  //   setSelectedId(node.id);
  //   onSelect?.(node, path);
  // }, [onSelect]);

  // TODO: Render the tree
  // Map over data and render TreeNode for each root item

  return (
    <div role="tree" aria-label="File explorer">
      {/* Your implementation here */}
      <p style={{ color: '#6c7086', padding: '20px' }}>
        TODO: Implement FileExplorer component
        <br />
        <small>Render TreeNode for each item in data</small>
      </p>
    </div>
  );
};

/**
 * SearchableFileExplorer - BONUS CHALLENGE
 * 
 * Extends FileExplorer with search functionality.
 * When user types in search box, filter the tree to show
 * only matching items (and their parent folders).
 */
export const SearchableFileExplorer: React.FC<FileExplorerProps> = ({
  data,
  onSelect,
}) => {
  // TODO: Add search state and filtering logic
  // const [searchQuery, setSearchQuery] = useState('');
  // const filteredData = useMemo(() => filterNodes(data, searchQuery), [data, searchQuery]);

  return (
    <div>
      <input
        type="text"
        className="search-box"
        placeholder="Search files..."
        // onChange={(e) => setSearchQuery(e.target.value)}
      />
      <FileExplorer data={data} onSelect={onSelect} />
    </div>
  );
};
