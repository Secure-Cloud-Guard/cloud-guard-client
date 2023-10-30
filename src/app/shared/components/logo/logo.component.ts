import { Component } from '@angular/core';
import { ThemeService, Theme } from "@shared";

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html'
})
export class LogoComponent {

  protected readonly Theme = Theme;

  constructor(
    protected readonly themeService: ThemeService
  ) { }
}
