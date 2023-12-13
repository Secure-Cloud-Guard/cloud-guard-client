/**
 * Represents the parameters required for rendering a social media icon in a user interface.
 *
 * @property {string} icon - The name or identifier of the social media icon.
 * @property {string} colorClass - The CSS class representing the color scheme of the icon.
 * @property {string} tooltip - The text to be displayed as a tooltip when the user hovers over the icon.
 * @property {boolean} disabled - A flag indicating whether the social media icon is disabled or not.
 */
export type SocialIconParameters = {
  icon: string;
  colorClass: string;
  tooltip: string;
  disabled: boolean;
};

/**
 * Represents the steps involved in a sign-up process.
 *
 * @interface SignUpSteps
 * @property {boolean} signUp - Indicates whether the user has completed the sign-up step.
 * @property {boolean} fillCode - Indicates whether the user has filled in a code (if applicable).
 * @property {boolean} login - Indicates whether the user has completed the login step.
 */
export interface SignUpSteps {
  signUp: boolean;
  fillCode: boolean;
  login: boolean;
}
