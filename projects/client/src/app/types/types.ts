
/**
 * Represents a node in a file system tree.
 */
export interface FileNode {
  name: string;
  url: string;
  size: number;
  lastModified: string;
  ownerId: string,
  owner: boolean,
  children?: FileNode[];
  isFolder: boolean;
  shadowFolder?: boolean,
  sharing?: BucketObjectSharing;
  isImage?: boolean;
  imageBase64?: string;
  active?: boolean;
  expanded?: boolean;
  encryptedUrl?: string;
}

export interface BucketObjectSharing {
  shared: boolean,
  shareWith?: ShareWithUser[],
}

export interface ShareWithUser {
  userId: string,
  userEmail: string,
  rights: AccessRights,
}

export enum AccessRights {
  Read = 'read',
  Write = 'write',
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
