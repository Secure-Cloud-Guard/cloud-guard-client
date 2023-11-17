import { Component, Input, OnInit } from '@angular/core';
import { SidenavItem } from "@modules/home/types";
import {LocalStorageKeys} from "@shared/const";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {
  @Input() items: SidenavItem[] = [];

  private _shortSidenav: boolean = false;

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
}
