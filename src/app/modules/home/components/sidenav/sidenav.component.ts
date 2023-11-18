import { Component, Input, OnInit } from '@angular/core';
import { SidenavItem } from "@modules/home/types";
import { LocalStorageKeys } from "@shared/const";
import { RouteService, ThemeColorService } from "@shared/services";
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {Theme} from "@shared/types";

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
  ) { }

  ngOnInit() {
    const savedState = localStorage.getItem(LocalStorageKeys.SHORT_SIDENAV);
    if (savedState) {
      this._shortSidenav = JSON.parse(savedState);
    }

    this.matIconRegistry
      .addSvgIcon('github', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'))
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
