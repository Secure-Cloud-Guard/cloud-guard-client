import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { SocialIconParameters } from "@modules/auth/types";

@Component({
  selector: 'app-social-icons',
  templateUrl: './social-icons.component.html'
})
export class SocialIconsComponent {

  socialIcons: SocialIconParameters[] = [
    { icon: 'facebook-simple', colorClass: 'disabled', tooltip: 'Facebook', disabled: true },
    { icon: 'google', colorClass: 'google', tooltip: 'Google', disabled: false },
    { icon: 'github', colorClass: 'disabled', tooltip: 'Github', disabled: true },
  ];

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry
      .addSvgIcon('google', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/google.svg'))
      .addSvgIcon('facebook-simple', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook-simple.svg'))
      .addSvgIcon('github', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));
  }

}
