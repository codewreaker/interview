import React from 'react';
import type { FileNode, TreeNodeProps } from './types';

/**
 * TreeNode Component - IMPLEMENT THIS
 * 
 * This is the recursive component that renders a single node
 * and its children in the file tree.
 * 
 * Requirements:
 * 1. Display the node with appropriate icon (📁/📂 for folders, 📄 for files)
 * 2. If it's a folder, show a chevron that indicates expanded/collapsed state
 * 3. When clicked:
 *    - If folder: toggle expanded state
 *    - Always: select the node
 * 4. Recursively render children if the folder is expanded
 * 5. Apply indentation based on depth
 * 6. Highlight if selected
 * 
 * Props:
 * - node: The file/folder data
 * - depth: Current nesting level (for indentation)
 * - path: Full path to this node (e.g., "src/components/Button")
 * - expandedIds: Set of folder IDs that are currently expanded
 * - selectedId: ID of the currently selected node
 * - onToggle: Callback when folder is expanded/collapsed
 * - onSelect: Callback when node is selected
 */
export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  depth,
  path,
  expandedIds,
  selectedId,
  onToggle,
  onSelect,
}) => {
  // TODO: Implement this component
  // 
  // Hints:
  // 1. Check if this is a folder: node.type === 'folder'
  // 2. Check if expanded: expandedIds.has(node.id)
  // 3. Check if selected: selectedId === node.id
  // 4. Build child path: `${path}/${child.name}`
  // 5. Handle click to toggle AND select
  // 6. Recursively render children when expanded

  return (
    <div>
      {/* Your implementation here */}
      <span>TODO: Implement TreeNode for "{node.name}"</span>
    </div>
  );
};
