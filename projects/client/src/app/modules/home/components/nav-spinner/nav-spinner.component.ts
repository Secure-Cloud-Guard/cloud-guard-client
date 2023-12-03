import { Component } from '@angular/core';
import { ThemeColorService } from "@globalShared";

@Component({
  selector: 'app-nav-spinner',
  templateUrl: './nav-spinner.component.html'
})
export class NavSpinnerComponent {

  constructor(
    protected readonly themeColorService: ThemeColorService
  ) { }
}
