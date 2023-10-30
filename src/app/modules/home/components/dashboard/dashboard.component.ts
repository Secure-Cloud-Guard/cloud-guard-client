import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private _short: boolean = false;

  toggle() {
    this._short = !this._short
  }

  get short(): boolean {
    return this._short;
  }
}
