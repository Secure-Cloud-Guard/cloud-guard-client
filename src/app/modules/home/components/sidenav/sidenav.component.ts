import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidenavItem } from "@modules/home/types";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent {
  @Input() items: SidenavItem[] = [];

  private _shortSidenav: boolean = false;

  toggleSidenav() {
    this._shortSidenav = !this._shortSidenav
  }

  get shortSidenav(): boolean {
    return this._shortSidenav;
  }
}
