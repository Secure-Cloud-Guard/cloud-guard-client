import { Component } from '@angular/core';
import { LoginService } from "@modules/auth/services";
import { AppRoutes } from "@shared/const";
import { HeaderDropdownItem } from "@shared/types";

/**
 * Header component responsible for displaying the application's header and theme toggling functionality.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  dropdownItemList: HeaderDropdownItem[] = [
    { icon: 'account_circle', label: 'Profile', url: AppRoutes.PROFILE.fullPath },
    { icon: 'settings', label: 'Settings', url: AppRoutes.SETTINGS.fullPath },
    { icon: 'exit_to_app', label: 'Logout', url: AppRoutes.LOGIN.fullPath },
  ];

  constructor(
    protected readonly loginService: LoginService
  ) { }

}
