import React from 'react';
import { createRoot } from 'react-dom/client';
import { FileExplorer } from './FileExplorer';
import { simpleFileTree } from './data';

const App: React.FC = () => {
  return <FileExplorer data={simpleFileTree} />;
};

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(<App />);
}
