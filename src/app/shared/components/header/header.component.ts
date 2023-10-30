import { Component } from '@angular/core';
import { LoginService } from "@modules/auth/services";

/**
 * Header component responsible for displaying the application's header and theme toggling functionality.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  constructor(
    protected readonly loginService: LoginService
  ) {}

}
