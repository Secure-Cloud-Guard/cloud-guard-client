import { Component } from '@angular/core';
import { LoginService } from "@modules/auth/services";
import { ThemeColorService } from "@shared/services";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = "";
  password: string = "";
  hide: boolean = true;

  constructor(
    private loginService: LoginService,
    protected readonly themeColorService: ThemeColorService
  ) {}

  onLogin() {
    this.loginService.login(this.username, this.password);
    this.resetLoginForm();
  }

  passwordToggle() {
    this.hide = !this.hide;
  }

  private resetLoginForm() {
    this.username = "";
    this.password = "";
  }
}
