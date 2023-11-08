import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from '@modules/home/components/dashboard/dashboard.component';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { SidenavListComponent } from './components/sidenav-list/sidenav-list.component';
import {MatTabsModule} from "@angular/material/tabs";


@NgModule({
  declarations: [
    DashboardComponent,
    SidenavListComponent
  ],
  exports: [
    DashboardComponent
  ],
    imports: [
        CommonModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        MatTabsModule
    ]
})
export class HomeModule { }
