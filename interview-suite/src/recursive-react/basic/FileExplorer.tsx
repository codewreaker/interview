import React from 'react';
import type { FileNode } from './types';

/**
 * ============================================================
 * BASIC FILE EXPLORER - Interview Challenge
 * ============================================================
 * 
 * Your task: Build a simple recursive file explorer.
 * 
 * Requirements:
 * 1. Display files with 📄 icon and folders with 📁 icon
 * 2. Clicking a folder toggles showing/hiding its children
 * 3. Indent children to show hierarchy
 * 
 * That's it! Keep it simple.
 * 
 * Hints:
 * - A component can render itself (recursion!)
 * - Use useState to track which folders are "open"
 * - Use CSS margin-left for indentation
 */

interface FileExplorerProps {
  data: FileNode[];
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ data }) => {
  // TODO: Implement this!
  // 
  // You'll need:
  // 1. State to track open folders: const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())
  // 2. A recursive component or function to render each node
  // 3. Click handler to toggle folders

  return (
    <div>
      <p style={{ color: '#888', padding: '20px' }}>
        TODO: Render the file tree here!
        <br /><br />
        Tip: Create a TreeNode component that renders itself for children.
      </p>
    </div>
  );
};

/**
 * OPTIONAL: You can create a separate TreeNode component
 * or handle everything in FileExplorer - your choice!
 */

// interface TreeNodeProps {
//   node: FileNode;
//   level: number;  // For indentation
//   isOpen: boolean;
//   onToggle: () => void;
// }

// const TreeNode: React.FC<TreeNodeProps> = ({ node, level, isOpen, onToggle }) => {
//   // TODO: Implement
// };
