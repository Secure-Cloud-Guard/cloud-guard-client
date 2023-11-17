
/**
 * Represents a theme option for the application.
 * @enum {string}
 */
export enum Theme {
  Light = 'theme-light',
  Dark = 'theme-dark'
}

/**
 * Enum representing different types of alerts.
 *
 * @enum {string}
 * @readonly
 * @property {string} Success - Indicates a successful alert.
 * @property {string} Info - Indicates an informational alert.
 * @property {string} Warning - Indicates a warning alert.
 * @property {string} Error - Indicates an error alert.
 */
export enum AlertType {
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

/**
 * Represents the data structure for an alert, including its type and message.
 *
 * @interface AlertData
 * @property {AlertType} type - The type of the alert (success, info, warning, error).
 * @property {string} message - The message to be displayed in the alert.
 */
export interface AlertData {
  type: AlertType,
  message: string
}

