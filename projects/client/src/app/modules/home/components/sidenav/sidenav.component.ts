import { Component, Input, OnInit } from '@angular/core';
import { SidenavItem } from "@modules/home/types";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { LocalStorageKeys, RouteService, ThemeColorService, Theme } from "@globalShared";


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {
  @Input() items: SidenavItem[] = [];

  private _shortSidenav: boolean = false;

  constructor(
    protected readonly themeColorService: ThemeColorService,
    protected readonly routeService: RouteService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry
      .addSvgIcon('github', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));
  }

  ngOnInit() {
    const savedState = localStorage.getItem(LocalStorageKeys.SHORT_SIDENAV);
    if (savedState) {
      this._shortSidenav = JSON.parse(savedState);
    }
  }

  toggleSidenav() {
    this._shortSidenav = !this._shortSidenav;
    localStorage.setItem(LocalStorageKeys.SHORT_SIDENAV, JSON.stringify(this._shortSidenav));
  }

  get shortSidenav(): boolean {
    return this._shortSidenav;
  }

  protected readonly Theme = Theme;
}
