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
  isSearching?: boolean;
  depth?: number;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({ data, isSearching, depth = 0 }) => {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (name: string, type: string) => () => {
    if (type === "folder") {
      setOpenFolders(prev => ({ ...prev, [name]: !prev[name] }));
    }
  };

  return (
    <>
      {data.map((file) => (
        <div key={file.name}>
          <h2 
            onClick={toggleFolder(file.name, file.type)}
            style={{ 
              marginLeft: `${depth * 20}px`,
              cursor: file.type === 'folder' ? 'pointer' : 'default'
            }}
          >
            <span className={file.type} />
            {file.name}
          </h2>
          {file.children && (openFolders[file.name] || isSearching) && (
            <FileExplorer 
              data={file.children} 
              isSearching={isSearching} 
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};
