/**
 * BASIC File Explorer Types
 * Simplified version for beginners
 */

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}
