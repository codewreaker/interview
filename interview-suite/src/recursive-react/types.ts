/**
 * File Explorer Types
 * 
 * These types define the structure for a recursive file/folder tree.
 */

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

export interface FileExplorerProps {
  data: FileNode[];
  onSelect?: (node: FileNode, path: string) => void;
}

export interface TreeNodeProps {
  node: FileNode;
  depth: number;
  path: string;
  expandedIds: Set<string>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onSelect: (node: FileNode, path: string) => void;
}
