import { Component } from '@angular/core';
import { CognitoService, AppRoutes, Theme, ThemeColorService, ThemeService } from "@globalShared";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  hide: boolean = true;
  showSpinner: boolean = false;

  protected readonly AppRoutes = AppRoutes;

  constructor(
    protected readonly cognitoService: CognitoService,
    protected readonly themeColorService: ThemeColorService,
    private themeService: ThemeService
  ) {
    this.cognitoService.fetchAuthSession().then((session) => {
      if (session.tokens) {
        this.cognitoService.signOut();
      }
    });
  }

  onLogin(event: Event|MouseEvent) {
    event.preventDefault();
    this.cognitoService.signIn({ username: this.email, password: this.password }).then(() => {
      this.showSpinner = true;
    })
  }

  passwordToggle() {
    this.hide = !this.hide;
  }

  getSpinnerBgColor(): string {
      return this.themeService.theme === Theme.Dark ? 'bg-black' : 'bg-white';
  }

  private resetLoginForm() {
    this.email = "";
    this.password = "";
  }
}
