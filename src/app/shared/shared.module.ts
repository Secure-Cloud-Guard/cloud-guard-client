import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { NgOptimizedImage } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { HeaderComponent, ThemeSwitchComponent, LogoComponent, GradientBackgroundComponent, AlertComponent } from "@shared/components";
import {RouterLink} from "@angular/router";


@NgModule({
  declarations: [
    HeaderComponent,
    ThemeSwitchComponent,
    LogoComponent,
    GradientBackgroundComponent,
    AlertComponent
  ],
  exports: [
    HeaderComponent,
    ThemeSwitchComponent,
    LogoComponent,
    GradientBackgroundComponent
  ],
    imports: [
        CommonModule,
        MatIconModule,
        MatToolbarModule,
        MatButtonModule,
        NgOptimizedImage,
        MatMenuModule,
        MatTooltipModule,
        MatSnackBarModule,
        RouterLink
    ]
})
export class SharedModule { }
