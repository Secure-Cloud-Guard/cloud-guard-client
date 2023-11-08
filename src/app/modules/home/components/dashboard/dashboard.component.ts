import { Component } from '@angular/core';
import { SidenavItem, TabGroupItem } from "@modules/home/types";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  sidenavItemList: SidenavItem[] = [
    { icon: 'lock', label: 'Personal Vault', url: '/route1' },
    { icon: 'cloud', label: 'Storage', url: '/route2' },
    { icon: 'account_circle', label: 'Profile', url: '/route3' },
    { icon: 'settings', label: 'Settings', url: '/route4' },
    { icon: 'exit_to_app', label: 'Logout', url: '/route5' },
  ];
  tabGroupItemList: TabGroupItem[] = [
    { icon: 'lock', url: '/route1' },
    { icon: 'cloud', url: '/route2' },
    { icon: 'account_circle', url: '/route3' },
    { icon: 'settings', url: '/route4' },
  ];
}
