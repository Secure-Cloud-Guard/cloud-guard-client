import { Component } from '@angular/core';
import { LoginService } from "@modules/auth";
import { Theme, ThemeService } from "@shared";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username: string = "";
  password: string = "";
  hide: boolean = true;
  protected readonly Theme = Theme;

  constructor(
    private loginService: LoginService,
    protected readonly themeService: ThemeService
  ) {}

  onLogin() {
    this.loginService.login(this.username, this.password);
    this.resetLoginForm();
  }

  passToggle() {
    this.hide = !this.hide;
  }

  private resetLoginForm() {
    this.username = "";
    this.password = "";
  }
}
