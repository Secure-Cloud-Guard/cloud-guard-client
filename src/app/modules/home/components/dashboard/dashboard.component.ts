import { Component } from '@angular/core';
import { SidenavItem, TabGroupItem } from "@modules/home/types";
import { AppRoutes } from "@shared/const";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  sidenavItemList: SidenavItem[] = [
    { icon: 'lock', label: 'Personal Vault', url: AppRoutes.PERSONAL_VAULT.fullPath },
    { icon: 'cloud', label: 'Storage', url: AppRoutes.STORAGE.fullPath },
    { icon: 'account_circle', label: 'Profile', url: AppRoutes.PROFILE.fullPath },
    { icon: 'settings', label: 'Settings', url: AppRoutes.SETTINGS.fullPath },
    { icon: 'exit_to_app', label: 'Logout', url: AppRoutes.LOGIN.fullPath },
  ];
  tabGroupItemList: TabGroupItem[] = [
    { icon: 'lock', url: '/route1' },
    { icon: 'cloud', url: '/route2' },
    { icon: 'account_circle', url: '/route3' },
    { icon: 'settings', url: '/route4' },
  ];
}
