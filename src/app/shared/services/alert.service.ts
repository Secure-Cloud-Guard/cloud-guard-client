import { Injectable } from '@angular/core';
import { AlertComponent } from "@shared/components";
import { MatSnackBar } from "@angular/material/snack-bar";

/**
 * Alert Service.
 * Service for displaying alert messages using Angular Material Snackbar.
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private snackBar: MatSnackBar) { }

  /**
   * Display an error alert.
   *
   * @param {string} message - The error message to display.
   */
  error(message: string) {
    this.openSnackBar(message, 'error-snackbar')
  }

  /**
   * Display a success alert.
   *
   * @param {string} message - The success message to display.
   */
  success(message: string) {
    this.openSnackBar(message, 'success-snackbar')
  }

  /**
   * Open a snackbar with the provided message and panel class.
   *
   * @private
   * @param {string} message - The message to display in the snackbar.
   * @param {string} panelClass - The CSS class to apply to the snackbar panel.
   */
  private openSnackBar(message: string, panelClass: string) {
    this.snackBar.openFromComponent(AlertComponent, {
      data: message,
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: panelClass
    });
  }
}
