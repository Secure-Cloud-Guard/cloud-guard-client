import { Component, Input } from '@angular/core';
import {AppRoutes, CognitoService, RouteService, ThemeColorService} from "@globalShared";
import { TabGroupItem } from "@modules/home/types";

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html'
})
export class TabGroupComponent {
  @Input() items: TabGroupItem[] = [];

  protected readonly AppRoutes = AppRoutes;

  constructor(
    protected readonly themeColorService: ThemeColorService,
    protected readonly routeService: RouteService,
    private cognitoService: CognitoService,
  ) { }

  logout() {
    this.cognitoService.signOut();
  }
}
