import { Component } from '@angular/core';
import { ThemeService } from "@shared/services";
import { Theme } from "@shared/types";

@Component({
  selector: 'app-gradient-background',
  templateUrl: './gradient-background.component.html',
  styleUrls: ['./gradient-background.component.scss']
})
export class GradientBackgroundComponent {

  protected readonly Theme = Theme;

  constructor(
    protected readonly themeService: ThemeService
  ) { }
}
