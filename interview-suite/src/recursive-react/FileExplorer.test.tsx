import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FileExplorer } from './FileExplorer';
import { TreeNode } from './TreeNode';
import type { FileNode } from './types';

// ============================================================================
// Test Data
// ============================================================================

const simpleTree: FileNode[] = [
  { id: '1', name: 'file1.ts', type: 'file' },
  { id: '2', name: 'file2.ts', type: 'file' },
];

const nestedTree: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      { id: '1-1', name: 'index.ts', type: 'file' },
      {
        id: '1-2',
        name: 'components',
        type: 'folder',
        children: [
          { id: '1-2-1', name: 'Button.tsx', type: 'file' },
          { id: '1-2-2', name: 'Input.tsx', type: 'file' },
        ],
      },
    ],
  },
  { id: '2', name: 'package.json', type: 'file' },
];

const deeplyNestedTree: FileNode[] = [
  {
    id: '1',
    name: 'level1',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'level2',
        type: 'folder',
        children: [
          {
            id: '3',
            name: 'level3',
            type: 'folder',
            children: [
              {
                id: '4',
                name: 'level4',
                type: 'folder',
                children: [
                  {
                    id: '5',
                    name: 'level5',
                    type: 'folder',
                    children: [
                      { id: '6', name: 'deepFile.ts', type: 'file' },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// ============================================================================
// FileExplorer Tests
// ============================================================================

describe('FileExplorer', () => {
  describe('Basic Rendering', () => {
    it('renders a list of files', () => {
      render(<FileExplorer data={simpleTree} />);
      
      expect(screen.getByText('file1.ts')).toBeInTheDocument();
      expect(screen.getByText('file2.ts')).toBeInTheDocument();
    });

    it('renders folders and files', () => {
      render(<FileExplorer data={nestedTree} />);
      
      expect(screen.getByText('src')).toBeInTheDocument();
      expect(screen.getByText('package.json')).toBeInTheDocument();
    });

    it('renders with tree role for accessibility', () => {
      render(<FileExplorer data={simpleTree} />);
      
      expect(screen.getByRole('tree')).toBeInTheDocument();
    });
  });

  describe('Expand/Collapse', () => {
    it('children are hidden by default', () => {
      render(<FileExplorer data={nestedTree} />);
      
      // Folder should be visible
      expect(screen.getByText('src')).toBeInTheDocument();
      
      // Children should NOT be visible initially
      expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
    });

    it('clicking a folder expands it to show children', () => {
      render(<FileExplorer data={nestedTree} />);
      
      // Click on folder
      fireEvent.click(screen.getByText('src'));
      
      // Children should now be visible
      expect(screen.getByText('index.ts')).toBeInTheDocument();
      expect(screen.getByText('components')).toBeInTheDocument();
    });

    it('clicking an expanded folder collapses it', () => {
      render(<FileExplorer data={nestedTree} />);
      
      // Expand folder
      fireEvent.click(screen.getByText('src'));
      expect(screen.getByText('index.ts')).toBeInTheDocument();
      
      // Collapse folder
      fireEvent.click(screen.getByText('src'));
      expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
    });

    it('can expand nested folders', () => {
      render(<FileExplorer data={nestedTree} />);
      
      // Expand first level
      fireEvent.click(screen.getByText('src'));
      expect(screen.getByText('components')).toBeInTheDocument();
      
      // Expand second level
      fireEvent.click(screen.getByText('components'));
      expect(screen.getByText('Button.tsx')).toBeInTheDocument();
      expect(screen.getByText('Input.tsx')).toBeInTheDocument();
    });
  });

  describe('Selection', () => {
    it('calls onSelect when item is clicked', () => {
      const onSelect = vi.fn();
      render(<FileExplorer data={simpleTree} onSelect={onSelect} />);
      
      fireEvent.click(screen.getByText('file1.ts'));
      
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'file1.ts' }),
        expect.any(String) // path
      );
    });

    it('passes correct path to onSelect', () => {
      const onSelect = vi.fn();
      render(<FileExplorer data={nestedTree} onSelect={onSelect} />);
      
      // Expand folder
      fireEvent.click(screen.getByText('src'));
      
      // Click nested file
      fireEvent.click(screen.getByText('index.ts'));
      
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'index.ts' }),
        'src/index.ts'
      );
    });

    it('highlights selected item', () => {
      render(<FileExplorer data={simpleTree} />);
      
      const fileItem = screen.getByText('file1.ts').closest('.tree-item');
      fireEvent.click(screen.getByText('file1.ts'));
      
      // The item should have selected class
      expect(fileItem).toHaveClass('selected');
    });
  });

  describe('Deep Nesting', () => {
    it('handles deeply nested structures (5+ levels)', () => {
      render(<FileExplorer data={deeplyNestedTree} />);
      
      // Expand all levels
      fireEvent.click(screen.getByText('level1'));
      fireEvent.click(screen.getByText('level2'));
      fireEvent.click(screen.getByText('level3'));
      fireEvent.click(screen.getByText('level4'));
      fireEvent.click(screen.getByText('level5'));
      
      // Deep file should be visible
      expect(screen.getByText('deepFile.ts')).toBeInTheDocument();
    });

    it('provides correct path for deeply nested items', () => {
      const onSelect = vi.fn();
      render(<FileExplorer data={deeplyNestedTree} onSelect={onSelect} />);
      
      // Expand all levels
      fireEvent.click(screen.getByText('level1'));
      fireEvent.click(screen.getByText('level2'));
      fireEvent.click(screen.getByText('level3'));
      fireEvent.click(screen.getByText('level4'));
      fireEvent.click(screen.getByText('level5'));
      
      // Click deep file
      fireEvent.click(screen.getByText('deepFile.ts'));
      
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'deepFile.ts' }),
        'level1/level2/level3/level4/level5/deepFile.ts'
      );
    });
  });
});

// ============================================================================
// TreeNode Tests
// ============================================================================

describe('TreeNode', () => {
  const defaultProps = {
    expandedIds: new Set<string>(),
    selectedId: null,
    onToggle: vi.fn(),
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('File Rendering', () => {
    it('renders file with file icon', () => {
      const fileNode: FileNode = { id: '1', name: 'test.ts', type: 'file' };
      
      render(
        <TreeNode 
          node={fileNode} 
          depth={0} 
          path="test.ts" 
          {...defaultProps} 
        />
      );
      
      expect(screen.getByText('test.ts')).toBeInTheDocument();
      // Should have file icon (📄)
      expect(screen.getByText('📄')).toBeInTheDocument();
    });

    it('does not show chevron for files', () => {
      const fileNode: FileNode = { id: '1', name: 'test.ts', type: 'file' };
      
      render(
        <TreeNode 
          node={fileNode} 
          depth={0} 
          path="test.ts" 
          {...defaultProps} 
        />
      );
      
      // Should not have chevron
      expect(screen.queryByText('▶')).not.toBeInTheDocument();
      expect(screen.queryByText('▼')).not.toBeInTheDocument();
    });
  });

  describe('Folder Rendering', () => {
    const folderNode: FileNode = { 
      id: '1', 
      name: 'src', 
      type: 'folder',
      children: [{ id: '1-1', name: 'index.ts', type: 'file' }]
    };

    it('renders folder with folder icon', () => {
      render(
        <TreeNode 
          node={folderNode} 
          depth={0} 
          path="src" 
          {...defaultProps} 
        />
      );
      
      expect(screen.getByText('src')).toBeInTheDocument();
      // Should have folder icon (📁 or 📂)
      expect(screen.getByText(/📁|📂/)).toBeInTheDocument();
    });

    it('shows collapsed chevron when folder is collapsed', () => {
      render(
        <TreeNode 
          node={folderNode} 
          depth={0} 
          path="src" 
          {...defaultProps}
          expandedIds={new Set()}
        />
      );
      
      const chevron = screen.getByText('▶');
      expect(chevron).toBeInTheDocument();
      expect(chevron).not.toHaveClass('expanded');
    });

    it('shows expanded chevron when folder is expanded', () => {
      render(
        <TreeNode 
          node={folderNode} 
          depth={0} 
          path="src" 
          {...defaultProps}
          expandedIds={new Set(['1'])}
        />
      );
      
      const chevron = screen.getByText('▶');
      expect(chevron).toHaveClass('expanded');
    });
  });

  describe('Interactions', () => {
    it('calls onToggle when folder is clicked', () => {
      const onToggle = vi.fn();
      const folderNode: FileNode = { 
        id: '1', 
        name: 'src', 
        type: 'folder',
        children: []
      };
      
      render(
        <TreeNode 
          node={folderNode} 
          depth={0} 
          path="src" 
          {...defaultProps}
          onToggle={onToggle}
        />
      );
      
      fireEvent.click(screen.getByText('src'));
      expect(onToggle).toHaveBeenCalledWith('1');
    });

    it('calls onSelect when any item is clicked', () => {
      const onSelect = vi.fn();
      const fileNode: FileNode = { id: '1', name: 'test.ts', type: 'file' };
      
      render(
        <TreeNode 
          node={fileNode} 
          depth={0} 
          path="test.ts" 
          {...defaultProps}
          onSelect={onSelect}
        />
      );
      
      fireEvent.click(screen.getByText('test.ts'));
      expect(onSelect).toHaveBeenCalledWith(fileNode, 'test.ts');
    });
  });

  describe('Selection State', () => {
    it('has selected class when selectedId matches', () => {
      const fileNode: FileNode = { id: '1', name: 'test.ts', type: 'file' };
      
      render(
        <TreeNode 
          node={fileNode} 
          depth={0} 
          path="test.ts" 
          {...defaultProps}
          selectedId="1"
        />
      );
      
      const treeItem = screen.getByText('test.ts').closest('.tree-item');
      expect(treeItem).toHaveClass('selected');
    });

    it('does not have selected class when selectedId differs', () => {
      const fileNode: FileNode = { id: '1', name: 'test.ts', type: 'file' };
      
      render(
        <TreeNode 
          node={fileNode} 
          depth={0} 
          path="test.ts" 
          {...defaultProps}
          selectedId="2"
        />
      );
      
      const treeItem = screen.getByText('test.ts').closest('.tree-item');
      expect(treeItem).not.toHaveClass('selected');
    });
  });

  describe('Recursive Rendering', () => {
    it('renders children when folder is expanded', () => {
      const folderNode: FileNode = { 
        id: '1', 
        name: 'src', 
        type: 'folder',
        children: [
          { id: '1-1', name: 'index.ts', type: 'file' },
          { id: '1-2', name: 'app.ts', type: 'file' },
        ]
      };
      
      render(
        <TreeNode 
          node={folderNode} 
          depth={0} 
          path="src" 
          {...defaultProps}
          expandedIds={new Set(['1'])}
        />
      );
      
      expect(screen.getByText('index.ts')).toBeInTheDocument();
      expect(screen.getByText('app.ts')).toBeInTheDocument();
    });

    it('does not render children when folder is collapsed', () => {
      const folderNode: FileNode = { 
        id: '1', 
        name: 'src', 
        type: 'folder',
        children: [
          { id: '1-1', name: 'index.ts', type: 'file' },
        ]
      };
      
      render(
        <TreeNode 
          node={folderNode} 
          depth={0} 
          path="src" 
          {...defaultProps}
          expandedIds={new Set()}
        />
      );
      
      expect(screen.queryByText('index.ts')).not.toBeInTheDocument();
    });
  });
});

// ============================================================================
// Utility Function Tests
// ============================================================================

describe('Utility Functions', () => {
  // Import utilities
  // import { countNodes, findNodeById, getAllFolderIds, filterNodes } from './mockData';

  describe('countNodes', () => {
    it.todo('counts files and folders correctly');
    it.todo('handles empty array');
    it.todo('handles deeply nested structures');
  });

  describe('findNodeById', () => {
    it.todo('finds node at root level');
    it.todo('finds deeply nested node');
    it.todo('returns null for non-existent id');
  });

  describe('getAllFolderIds', () => {
    it.todo('returns all folder IDs');
    it.todo('does not include file IDs');
  });

  describe('filterNodes', () => {
    it.todo('filters nodes by name');
    it.todo('includes parent folders of matching items');
    it.todo('returns all nodes when query is empty');
  });
});
