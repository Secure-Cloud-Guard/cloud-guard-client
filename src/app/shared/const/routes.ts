/**
 * Constants representing application routes with relative and full paths.
 *
 * @readonly
 * @enum {Object}
 * @property {string} relativePath - The relative path without the base path.
 * @property {string} fullPath - The full path including the base path.
 *
 * @example
 * // Accessing the relative and full paths for the PERSONAL_VAULT route
 * const personalVaultRelativePath = AppRoutes.PERSONAL_VAULT.relativePath; // 'personal-vault'
 * const personalVaultFullPath = AppRoutes.PERSONAL_VAULT.fullPath; // '/dashboard/personal-vault'
 */
export const AppRoutes = {
  LOGIN: {
    relativePath: 'login',
    fullPath: '/login'
  },
  DASHBOARD: {
    relativePath: 'dashboard',
    fullPath: '/dashboard'
  },
  PERSONAL_VAULT: {
    relativePath: 'personal-vault',
    fullPath: '/dashboard/personal-vault'
  },
  STORAGE: {
    relativePath: 'storage',
    fullPath: '/dashboard/storage'
  },
  PROFILE: {
    relativePath: 'profile',
    fullPath: '/dashboard/profile'
  },
  SETTINGS: {
    relativePath: 'settings',
    fullPath: '/dashboard/settings'
  }
};
