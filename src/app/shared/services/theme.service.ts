import { Injectable } from '@angular/core';
import { Theme } from "@shared";

/**
 * Service for managing the application theme.
 * This service provides methods for setting and getting the application theme.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme: Theme = Theme.Light;

  constructor() {
    const storedTheme = localStorage.getItem('appTheme');
    this._theme = (storedTheme as Theme) || this.getSystemTheme();
    document.body.classList.add(this._theme);
  }

  /**
   * Get the current application theme.
   *
   * @returns {@link Theme} The current theme.
   */
  get theme(): Theme {
    return this._theme;
  }

  /**
   * Set the application theme.
   *
   * @param {@link Theme} theme The theme to set.
   */
  set theme(theme: Theme) {
    document.body.classList.remove(this._theme);
    document.body.classList.add(theme);

    localStorage.setItem('appTheme', theme);
    this._theme = theme;
  }

  /**
   * Get the system theme based on the user's preference.
   *
   * @returns {@link Theme} The system theme.
   */
  private getSystemTheme(): Theme {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return Theme.Dark;
    }
    return Theme.Light;
  }
}
