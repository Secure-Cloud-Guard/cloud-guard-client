import { Component } from '@angular/core';
import { CurrentProjectService, ThemeService } from "../../services";
import { Theme } from "../../types";
import { AssetsUrl } from "../../const";

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html'
})
export class LogoComponent {

  private logoDark: string = ''
  private logoLight: string = ''

  constructor(
    private currentProject: CurrentProjectService,
    protected readonly themeService: ThemeService
  ) {
     const project = currentProject.getCurrentProject();
     this.logoDark = AssetsUrl(project).logoDark;
     this.logoLight = AssetsUrl(project).logoLight;
  }

  public getLogo(): string {
    return this.themeService.theme === Theme.Dark ? this.logoDark : this.logoLight;
  }
}
