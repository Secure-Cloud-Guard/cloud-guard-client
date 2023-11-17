import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ThemeService } from "@shared/services";
import { Theme } from "@shared/types";

@Component({
  selector: 'app-theme-switch',
  templateUrl: './theme-switch.component.html'
})
export class ThemeSwitchComponent implements OnInit {
  protected readonly Theme = Theme;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    protected readonly themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.matIconRegistry
      .addSvgIcon('moon', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/moon.svg'))
      .addSvgIcon('sun', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/sun.svg'));
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
