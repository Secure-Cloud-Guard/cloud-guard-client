import { Injectable } from '@angular/core';
import { AppRoutes } from "@shared/const";
import { Router } from "@angular/router";
import { AlertService } from "@shared/services";

/**
 * Service for handling user authentication and login status.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _isLoggedIn: boolean = false;
  private _userName: string = "";

  constructor(
    private router: Router,
    private alertService: AlertService
  ) {
    this._isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  /**
   * Attempt to log in with a given username and password.
   * @param username - The user's username.
   * @param password - The user's password.
   * @returns True if the login is successful, false otherwise.
   */
  login(username: string, password: string): boolean {
    this._isLoggedIn = username === 'admin' && password === 'admin';

    if (!this._isLoggedIn) {
      this.alertService.error('Incorrect username or password');
      return false;
    }

    this._userName = username;
    localStorage.setItem('isLoggedIn', 'true');

    this.router.navigate([AppRoutes.DASHBOARD]).then(() => {
      this.alertService.success('You have successfully logged in!')
    });

    return this._isLoggedIn;
  }

  logout(): void {
    this._isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    this.router.navigate([AppRoutes.LOGIN]);
  }

  /**
   * Get the current login status.
   * @returns True if the user is logged in, false otherwise.
   */
  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }

  get userName(): string {
    return this._userName;
  }
}
