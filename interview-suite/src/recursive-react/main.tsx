import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { FileExplorer } from './FileExplorer';
import { sampleFileTree, countNodes } from './mockData';
import type { FileNode } from './types';

/**
 * Main App Component
 * 
 * Renders the FileExplorer with sample data and displays
 * selection information.
 */
const App: React.FC = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  
  const stats = countNodes(sampleFileTree);

  const handleSelect = useCallback((node: FileNode, path: string) => {
    setSelectedNode(node);
    setSelectedPath(path);
    
    // Update the DOM elements outside React (for the instruction panel)
    const pathEl = document.getElementById('selected-path');
    const statsEl = document.getElementById('stats');
    
    if (pathEl) {
      pathEl.textContent = path;
      pathEl.style.color = '#a6e3a1';
    }
    
    if (statsEl) {
      statsEl.textContent = `Folders: ${stats.folders} | Files: ${stats.files}`;
    }
  }, [stats]);

  return (
    <FileExplorer 
      data={sampleFileTree} 
      onSelect={handleSelect}
    />
  );
};

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
