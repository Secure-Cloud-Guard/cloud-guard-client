/**
 * Represents an item for a sidenav menu.
 * This interface defines the structure of an item used in a sidenav menu.
 *
 * @property {string} icon - The icon to be displayed for the sidenav item.
 * @property {string} label - The label or text associated with the sidenav item.
 * @property {string} url - The URL or route associated with the sidenav item.
 */
export interface SidenavItem {
  icon: string,
  label: string,
  url: string
}

/**
 * Represents an item for a tab group in a mobile application.
 * This interface defines the structure of an item used in a tab group designed for mobile devices.
 *
 * @property {string} icon - The icon to be displayed for the tab.
 * @property {string} url - The URL or route associated with the tab.
 */
export interface TabGroupItem {
  icon: string,
  url: string
}

/**
 * Enum representing different types of navigation.
 * Use this enum to define the possible navigation types in your application.
 *
 * @enum {string}
 */
export enum NavigationType {
  Sidenav = 'sidenav',
  TabGroup = 'tab-group',
}
