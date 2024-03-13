import { Component } from '@angular/core';
import { SidenavItem, TabGroupItem } from "@modules/home/types";
import { AppRoutes } from "@globalShared";
import { NavService } from "@modules/home/services";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  constructor(
    protected readonly navService: NavService
  ) { }

  sidenavItemList: SidenavItem[] = [
    { icon: 'lock', label: 'Personal Vault', url: AppRoutes.MAIN.PERSONAL_VAULT.fullPath },
    { icon: 'cloud', label: 'Storage', url: AppRoutes.MAIN.STORAGE.fullPath },
    { icon: 'account_circle', label: 'Profile', disabled: true, url: AppRoutes.MAIN.PROFILE.fullPath },
    { icon: 'settings', label: 'Settings', disabled: true, url: AppRoutes.MAIN.SETTINGS.fullPath },
    { icon: 'exit_to_app', label: 'Logout', url: AppRoutes.AUTH.LOGIN.fullPath },
  ];
  tabGroupItemList: TabGroupItem[] = [
    { icon: 'lock', url: AppRoutes.MAIN.PERSONAL_VAULT.fullPath },
    { icon: 'cloud', url: AppRoutes.MAIN.STORAGE.fullPath },
    { icon: 'account_circle', disabled: true, url: AppRoutes.MAIN.PROFILE.fullPath },
    { icon: 'settings', disabled: true, url: AppRoutes.MAIN.SETTINGS.fullPath },
    { icon: 'exit_to_app', url: AppRoutes.AUTH.LOGIN.fullPath },
  ];
}
