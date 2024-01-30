import { Component } from '@angular/core';
import { ThemeService } from "../../services";
import { Theme } from "../../types";

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html'
})
export class LogoComponent {

  private logoDark: string = 'assets/logo-dark.svg'
  private logoLight: string = 'assets/logo-light.svg'

  constructor(
    protected readonly themeService: ThemeService
  ) { }

  public getLogo(): string {
    return this.themeService.theme === Theme.Dark ? this.logoDark : this.logoLight;
  }
}
