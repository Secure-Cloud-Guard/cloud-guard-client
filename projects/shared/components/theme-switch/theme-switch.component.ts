import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CurrentProjectService, ThemeService } from "../../services";
import { Theme } from "../../types";
import { AssetsUrl } from "../../const";

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html'
})
export class ThemeSwitchComponent {
  protected readonly Theme = Theme;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private currentProject: CurrentProjectService,
    protected readonly themeService: ThemeService
  ) {
    const project = currentProject.getCurrentProject();
    const moonIcon: string = AssetsUrl(project).moonIcon;
    const sunIcon: string = AssetsUrl(project).sunIcon;

    this.matIconRegistry
      .addSvgIcon('moon', this.domSanitizer.bypassSecurityTrustResourceUrl(moonIcon))
      .addSvgIcon('sun', this.domSanitizer.bypassSecurityTrustResourceUrl(sunIcon));
  }

  /**
   * Toggle the application theme between {@link Theme.Light} and {@link Theme.Dark} modes.
   */
  themeToggle() {
    if (this.themeService.theme === Theme.Light) {
      this.themeService.theme = Theme.Dark;
    } else {
      this.themeService.theme = Theme.Light;
    }
  }
}
