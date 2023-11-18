import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTabsModule } from "@angular/material/tabs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { RouterLink, RouterOutlet } from "@angular/router";
import { DashboardComponent, SidenavComponent, TabGroupComponent, NavSpinnerComponent } from '@modules/home/components';
import { SharedModule } from "@shared";


@NgModule({
  declarations: [
    DashboardComponent,
    SidenavComponent,
    TabGroupComponent,
    NavSpinnerComponent
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
        RouterOutlet,
        RouterLink,
        MatProgressSpinnerModule
    ]
})
export class HomeModule { }
