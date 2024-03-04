
/**
 * Represents a node in a file system tree.
 */
export interface FileNode {
  name: string;
  url: string;
  size: number;
  lastModified: string;
  children?: FileNode[];
  isFolder: boolean;
  shared?: boolean;
  isImage?: boolean;
  imageBase64?: string;
  active?: boolean;
  expanded?: boolean;
  encryptedUrl?: string;
}

/**
 * View modes available for the file manager.
 */
export const VIEW_MODE = {
  MODULE: 'module',
  LIST: 'list',
}

/**
 * Enum representing different types of file managers.
 */
export enum FileManagerType {
  PersonalVault = 'personal-vault',
  Storage = 'storage',
}
