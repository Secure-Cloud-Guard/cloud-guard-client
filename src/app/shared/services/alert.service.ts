import { Injectable } from '@angular/core';
import { AlertComponent } from "@shared/components";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AlertData, AlertType } from "@shared/types";

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
    this.openSnackBar(message, AlertType.Error)
  }

  /**
   * Display a success alert.
   *
   * @param {string} message - The success message to display.
   */
  success(message: string) {
    this.openSnackBar(message, AlertType.Success)
  }

  /**
   * Display an info alert.
   *
   * @param {string} message - The info message to display.
   */
  info(message: string) {
    this.openSnackBar(message, AlertType.Info)
  }

  /**
   * Open a snackbar with the provided message and panel class.
   *
   * @param {string} message - The message to display in the snackbar.
   * @param {AlertType} alertType - The type of alert (success, info, warning, error).
   */
  private openSnackBar(message: string, alertType: AlertType) {
    const alertData: AlertData = { type: alertType, message: message }

    this.snackBar.openFromComponent(AlertComponent, {
      data: alertData,
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: alertType + '-snackbar'
    });
  }
}
