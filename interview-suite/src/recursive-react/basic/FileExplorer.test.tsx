import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileExplorer } from './FileExplorer';
import type { FileNode } from './types';

const testData: FileNode[] = [
  { name: 'file1.ts', type: 'file' },
  {
    name: 'folder1',
    type: 'folder',
    children: [
      { name: 'nested.ts', type: 'file' },
    ],
  },
];

describe('Basic FileExplorer', () => {
  it('renders files', () => {
    render(<FileExplorer data={testData} />);
    expect(screen.getByText('file1.ts')).toBeInTheDocument();
  });

  it('renders folders', () => {
    render(<FileExplorer data={testData} />);
    expect(screen.getByText('folder1')).toBeInTheDocument();
  });

  it('hides folder children by default', () => {
    render(<FileExplorer data={testData} />);
    expect(screen.queryByText('nested.ts')).not.toBeInTheDocument();
  });

  it('shows children when folder is clicked', () => {
    render(<FileExplorer data={testData} />);
    
    fireEvent.click(screen.getByText('folder1'));
    
    expect(screen.getByText('nested.ts')).toBeInTheDocument();
  });

  it('hides children when open folder is clicked again', () => {
    render(<FileExplorer data={testData} />);
    
    // Open
    fireEvent.click(screen.getByText('folder1'));
    expect(screen.getByText('nested.ts')).toBeInTheDocument();
    
    // Close
    fireEvent.click(screen.getByText('folder1'));
    expect(screen.queryByText('nested.ts')).not.toBeInTheDocument();
  });

  it('shows file icon for files', () => {
    render(<FileExplorer data={testData} />);
    const fileElement = screen.getByText('file1.ts').parentElement?.querySelector('.file');
    expect(fileElement).toBeInTheDocument();
  });

  it('shows folder icon for folders', () => {
    render(<FileExplorer data={testData} />);
    const folderElement = screen.getByText('folder1').parentElement?.querySelector('.folder');
    expect(folderElement).toBeInTheDocument();
  });
});
