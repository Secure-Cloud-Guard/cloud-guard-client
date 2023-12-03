import { Component } from '@angular/core';
import { AppRoutes } from "../../const";
import { HeaderDropdownItem } from "../../types";

/**
 * Header component responsible for displaying the application's header and theme toggling functionality.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  dropdownItemList: HeaderDropdownItem[] = [
    { icon: 'account_circle', label: 'Profile', url: AppRoutes.MAIN.PROFILE.fullPath },
    { icon: 'settings', label: 'Settings', url: AppRoutes.MAIN.SETTINGS.fullPath },
    { icon: 'exit_to_app', label: 'Logout', url: AppRoutes.AUTH.LOGIN.fullPath },
  ];
}
