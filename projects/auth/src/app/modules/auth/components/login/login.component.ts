import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CognitoService } from "@modules/auth/services";
import { ThemeColorService, ThemeService, Theme } from "@globalShared";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  hide: boolean = true;
  protected readonly Theme = Theme;

  constructor(
    protected readonly cognitoService: CognitoService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    protected readonly themeColorService: ThemeColorService,
    protected readonly themeService: ThemeService
  ) {
    this.matIconRegistry
      .addSvgIcon('google', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/google.svg'));
  }

  onLogin(event: Event|MouseEvent) {
    event.preventDefault();
    this.cognitoService.signIn({ username: this.email, password: this.password }).then(() => {
      this.resetLoginForm();
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
