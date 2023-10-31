import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SidenavItem } from "@modules/home/types";

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html'
})
export class SidenavListComponent {
  @Input() items: SidenavItem[] = [];
  @Input() shortSidenav: boolean = false;
  @Output() toggleSidenavState = new EventEmitter<void>();

  toggleSidenav() {
    this.toggleSidenavState.emit();
  }
}
