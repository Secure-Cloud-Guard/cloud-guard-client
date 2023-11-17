import {Component, Input} from '@angular/core';
import { ThemeColorService } from "@shared/services";
import { TabGroupItem } from "@modules/home/types";

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html'
})
export class TabGroupComponent {
  @Input() items: TabGroupItem[] = [];

  constructor(
    protected readonly themeColorService: ThemeColorService
  ) { }
}
