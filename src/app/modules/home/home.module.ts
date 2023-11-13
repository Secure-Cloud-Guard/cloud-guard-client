import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTabsModule } from "@angular/material/tabs";
import { RouterOutlet } from "@angular/router";
import { DashboardComponent, SidenavComponent, TabGroupComponent } from '@modules/home/components';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [
    DashboardComponent,
    SidenavComponent,
    TabGroupComponent
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
    MatTabsModule,
    SharedModule,
    RouterOutlet
  ]
})
export class HomeModule { }
