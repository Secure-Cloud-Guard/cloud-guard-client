import { Component } from '@angular/core';
import { ThemeService } from "../../services";
import { Theme } from "../../types";

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
