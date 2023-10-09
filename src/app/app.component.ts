import {Component, HostBinding} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private isDark = true;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry
      .addSvgIcon('moon', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/moon.svg'))
      .addSvgIcon('sun', this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/sun.svg'));
  }

  @HostBinding('class')
  get themeMode() {
    return this.isDark ? 'theme-dark' : 'theme-light';
  }

  themeToggle() {
    this.isDark = !this.isDark;
  }

  isDarkMode() {
    return this.isDark;
  }
}
