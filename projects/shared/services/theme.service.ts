import { Injectable } from '@angular/core';
import { Theme } from "../types";
import { BehaviorSubject, Observable  } from "rxjs";
import { LocalStorageKeys } from "../const";

/**
 * Service for managing the application theme.
 * This service provides methods for setting and getting the application theme.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _theme: Theme = Theme.Light;
  private themeChangeSubject: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(this._theme);

  constructor() {
    const storedTheme = localStorage.getItem(LocalStorageKeys.APP_THEME);
    this.theme = (storedTheme as Theme) || this.getSystemTheme();

    document.body.classList.add(this._theme);
    document.documentElement.classList.add(this._theme);
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
   * @param {Theme} theme The theme to set.
   */
  set theme(theme: Theme) {
    localStorage.setItem(LocalStorageKeys.APP_THEME, theme);

    const bodyClassList = document.body.classList;
    const htmlClassList = document.documentElement.classList;

    bodyClassList.remove(this._theme);
    bodyClassList.add(theme);

    // for custom sidebar
    htmlClassList.remove(this._theme);
    htmlClassList.add(theme);

    this._theme = theme;
    this.themeChangeSubject.next(theme);
  }

  /**
   * An observable property that emits the current theme whenever it changes.
   * You can subscribe to this property to be notified when the theme changes in the application.
   *
   * @returns {@link Observable} that emits the current theme whenever it changes.
   */
  get onChange(): Observable<Theme> {
    return this.themeChangeSubject.asObservable();
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
