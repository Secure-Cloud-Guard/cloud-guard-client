import { Component } from '@angular/core';
import { ThemeService } from "@shared/services";
import { Theme } from "@shared/types";

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
