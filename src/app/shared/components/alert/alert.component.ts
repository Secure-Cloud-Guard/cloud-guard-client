import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string,
    private snackBarRef: MatSnackBarRef<AlertComponent>
  ) { }

  public dismissAlert() {
    this.snackBarRef.dismiss();
  }
}
