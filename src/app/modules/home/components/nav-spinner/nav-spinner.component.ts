import { Component } from '@angular/core';
import { ThemeColorService } from "@shared/services";

@Component({
  selector: 'app-nav-spinner',
  templateUrl: './nav-spinner.component.html'
})
export class NavSpinnerComponent {

  constructor(
    protected readonly themeColorService: ThemeColorService
  ) { }
}
