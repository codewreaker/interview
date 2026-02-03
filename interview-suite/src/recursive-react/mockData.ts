import type { FileNode } from './types';

/**
 * Sample file tree data for testing the File Explorer component.
 * This represents a typical project structure with nested folders.
 */
export const sampleFileTree: FileNode[] = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '1-1',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: '1-1-1',
            name: 'Button',
            type: 'folder',
            children: [
              { id: '1-1-1-1', name: 'Button.tsx', type: 'file' },
              { id: '1-1-1-2', name: 'Button.test.tsx', type: 'file' },
              { id: '1-1-1-3', name: 'Button.css', type: 'file' },
              { id: '1-1-1-4', name: 'index.ts', type: 'file' },
            ],
          },
          {
            id: '1-1-2',
            name: 'Input',
            type: 'folder',
            children: [
              { id: '1-1-2-1', name: 'Input.tsx', type: 'file' },
              { id: '1-1-2-2', name: 'Input.test.tsx', type: 'file' },
              { id: '1-1-2-3', name: 'Input.css', type: 'file' },
            ],
          },
          {
            id: '1-1-3',
            name: 'Modal',
            type: 'folder',
            children: [
              { id: '1-1-3-1', name: 'Modal.tsx', type: 'file' },
              { id: '1-1-3-2', name: 'Modal.css', type: 'file' },
              { id: '1-1-3-3', name: 'useModal.ts', type: 'file' },
            ],
          },
        ],
      },
      {
        id: '1-2',
        name: 'hooks',
        type: 'folder',
        children: [
          { id: '1-2-1', name: 'useLocalStorage.ts', type: 'file' },
          { id: '1-2-2', name: 'useDebounce.ts', type: 'file' },
          { id: '1-2-3', name: 'useFetch.ts', type: 'file' },
        ],
      },
      {
        id: '1-3',
        name: 'utils',
        type: 'folder',
        children: [
          { id: '1-3-1', name: 'helpers.ts', type: 'file' },
          { id: '1-3-2', name: 'constants.ts', type: 'file' },
          { id: '1-3-3', name: 'api.ts', type: 'file' },
        ],
      },
      { id: '1-4', name: 'App.tsx', type: 'file' },
      { id: '1-5', name: 'main.tsx', type: 'file' },
      { id: '1-6', name: 'index.css', type: 'file' },
    ],
  },
  {
    id: '2',
    name: 'public',
    type: 'folder',
    children: [
      { id: '2-1', name: 'index.html', type: 'file' },
      { id: '2-2', name: 'favicon.ico', type: 'file' },
      {
        id: '2-3',
        name: 'images',
        type: 'folder',
        children: [
          { id: '2-3-1', name: 'logo.png', type: 'file' },
          { id: '2-3-2', name: 'hero.jpg', type: 'file' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'tests',
    type: 'folder',
    children: [
      { id: '3-1', name: 'setup.ts', type: 'file' },
      {
        id: '3-2',
        name: 'integration',
        type: 'folder',
        children: [
          { id: '3-2-1', name: 'app.test.ts', type: 'file' },
          { id: '3-2-2', name: 'navigation.test.ts', type: 'file' },
        ],
      },
    ],
  },
  { id: '4', name: 'package.json', type: 'file' },
  { id: '5', name: 'tsconfig.json', type: 'file' },
  { id: '6', name: 'README.md', type: 'file' },
  { id: '7', name: '.gitignore', type: 'file' },
];

/**
 * Utility to count files and folders in the tree
 */
export function countNodes(nodes: FileNode[]): { files: number; folders: number } {
  let files = 0;
  let folders = 0;

  function traverse(node: FileNode) {
    if (node.type === 'file') {
      files++;
    } else {
      folders++;
      node.children?.forEach(traverse);
    }
  }

  nodes.forEach(traverse);
  return { files, folders };
}

/**
 * Utility to find a node by ID
 */
export function findNodeById(nodes: FileNode[], id: string): FileNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Utility to get all folder IDs (for expand all functionality)
 */
export function getAllFolderIds(nodes: FileNode[]): string[] {
  const ids: string[] = [];

  function traverse(node: FileNode) {
    if (node.type === 'folder') {
      ids.push(node.id);
      node.children?.forEach(traverse);
    }
  }

  nodes.forEach(traverse);
  return ids;
}

/**
 * Utility to filter nodes based on search query
 */
export function filterNodes(nodes: FileNode[], query: string): FileNode[] {
  if (!query.trim()) return nodes;
  
  const lowerQuery = query.toLowerCase();

  function nodeMatches(node: FileNode): FileNode | null {
    const nameMatches = node.name.toLowerCase().includes(lowerQuery);
    
    if (node.type === 'file') {
      return nameMatches ? node : null;
    }

    // For folders, include if name matches OR any children match
    const filteredChildren = node.children
      ?.map(nodeMatches)
      .filter((n): n is FileNode => n !== null);

    if (nameMatches || (filteredChildren && filteredChildren.length > 0)) {
      return {
        ...node,
        children: filteredChildren || [],
      };
    }

    return null;
  }

  return nodes
    .map(nodeMatches)
    .filter((n): n is FileNode => n !== null);
}
