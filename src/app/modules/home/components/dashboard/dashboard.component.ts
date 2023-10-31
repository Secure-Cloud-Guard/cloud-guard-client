import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  sidenavItemList = [
    { icon: 'lock', label: 'Personal Vault', url: '/route1' },
    { icon: 'cloud', label: 'Storage', url: '/route2' },
    { icon: 'account_circle', label: 'Profile', url: '/route3' },
    { icon: 'settings', label: 'Settings', url: '/route4' },
    { icon: 'exit_to_app', label: 'Logout', url: '/route5' },
  ];
  private _shortSidenav: boolean = false;

  toggleSidenav() {
    this._shortSidenav = !this._shortSidenav
  }

  get shortSidenav(): boolean {
    return this._shortSidenav;
  }
}
