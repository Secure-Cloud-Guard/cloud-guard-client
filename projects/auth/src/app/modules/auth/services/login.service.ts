import { Injectable } from '@angular/core';
import { AppRoutes, LocalStorageKeys, AlertService } from "@globalShared";
import { Router } from "@angular/router";

/**
 * Service for handling user authentication and login status.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private sessionTimeout: number = 60 * 60 * 1000;  // 1 hour in milliseconds

  constructor(
    private router: Router,
    private alertService: AlertService
  ) { }

  private updateLoginStatus(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      localStorage.setItem(LocalStorageKeys.LAST_LOGIN_TIME, new Date().getTime().toString());
    } else {
      localStorage.removeItem(LocalStorageKeys.LAST_LOGIN_TIME);
    }
  }

  /**
   * Attempt to log in with a given username and password.
   * @param username - The user's username.
   * @param password - The user's password.
   * @returns True if the login is successful, false otherwise.
   */
  login(username: string, password: string): boolean {
    const isLoggedIn = username === 'admin' && password === 'admin';

    if (!isLoggedIn) {
      this.alertService.error('Incorrect username or password');
      return false;
    }

    this.updateLoginStatus(true);

    this.router.navigate([AppRoutes.MAIN.DASHBOARD.relativePath]).then(() => {
      this.alertService.success('You have successfully logged in!')
    });

    return true;
  }

  logout(): void {
    this.updateLoginStatus(false);

    this.router.navigate([AppRoutes.AUTH.LOGIN.relativePath]).then(() => {
      this.alertService.info('You have been successfully logged out.')
    });
  }

  /**
   * Get the current login status.
   * @returns True if the user is logged in, false otherwise.
   */
  get isLoggedIn(): boolean {
    const lastLoginTime = localStorage.getItem(LocalStorageKeys.LAST_LOGIN_TIME);

    if (lastLoginTime) {
      const currentTime = new Date().getTime();
      return currentTime - parseInt(lastLoginTime, 10) < this.sessionTimeout;
    }

    return false;
  }
}
