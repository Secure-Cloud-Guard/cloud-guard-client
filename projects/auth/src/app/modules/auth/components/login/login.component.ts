import { Component } from '@angular/core';
import { CognitoService } from "@modules/auth/services";
import { AppRoutes, ThemeColorService } from "@globalShared";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  hide: boolean = true;

  protected readonly AppRoutes = AppRoutes;

  constructor(
    protected readonly cognitoService: CognitoService,
    protected readonly themeColorService: ThemeColorService
  ) { }

  onLogin(event: Event|MouseEvent) {
    event.preventDefault();
    this.cognitoService.signIn({ username: this.email, password: this.password }).then(() => {
      this.resetLoginForm();
      window.location.href = 'https://cloud-guard.app/';
    })
  }

  passwordToggle() {
    this.hide = !this.hide;
  }

  private resetLoginForm() {
    this.email = "";
    this.password = "";
  }
}
