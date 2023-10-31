import { Injectable } from '@angular/core';

/**
 * Service for handling user authentication and login status.
 */
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private _isLoggedIn: boolean = false;
  private _userName: string = "";

  /**
   * Attempt to log in with a given username and password.
   * @param username - The user's username.
   * @param password - The user's password.
   * @returns True if the login is successful, false otherwise.
   */
  login(username: string, password: string): boolean {
    this._isLoggedIn = username === 'admin' && password === 'admin';

    if (this._isLoggedIn) {
      this._userName = username;
    }

    return this._isLoggedIn;
  }

  logout(): void {
    this._isLoggedIn = false;
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
