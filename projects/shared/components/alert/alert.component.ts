import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { AlertData, AlertType } from "../../types";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: AlertData,
    private snackBarRef: MatSnackBarRef<AlertComponent>
  ) { }

  public dismissAlert() {
    this.snackBarRef.dismiss();
  }

  /**
   * Gets the icon name based on the alert type.
   *
   * @returns {string} - The icon name.
   */
  public getIconName(): string {
    switch (this.data.type) {
      case AlertType.Success:
        return 'check_circle';
      case AlertType.Info:
        return 'info';
      case AlertType.Warning:
        return 'warning';
      case AlertType.Error:
        return 'error';
      default:
        return '';
    }
  }
}
