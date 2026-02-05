import React, { useState } from 'react';
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
  const [showMap, setShowMap] = useState<Record<string, boolean>>({});

  const toggleFolder=({name,type}:FileNode)=>()=>{
    if (type === "folder"){
      setShowMap(prev=>{
        if(prev[name] !== undefined){
          return {...prev, [name]:!prev[name]}
        }
        return {...prev, [name]:true}
      });
    }
  }
  // TODO: Implement this!
  // 
  // You'll need:
  // 1. State to track open folders: const [openFolders, setOpenFolders] = useState<Set<string>>(new Set())
  // 2. A recursive component or function to render each node
  // 3. Click handler to toggle folders

  return (data.map((file, idx) => (
    <div key={file.name} className='file-explorer'>
      <h2 onClick={toggleFolder(file)}><span className={file.type}/>{file.name}</h2>
      {(file.children && showMap[file.name]) &&<FileExplorer data={file.children} />}
    </div>
  )))
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
