import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { NgOptimizedImage } from "@angular/common";
import { HeaderComponent, ThemeSwitchComponent, LogoComponent } from "@shared/components";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
  declarations: [
    HeaderComponent,
    ThemeSwitchComponent,
    LogoComponent
  ],
  exports: [
    HeaderComponent,
    ThemeSwitchComponent,
    LogoComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    NgOptimizedImage,
    MatMenuModule
  ]
})
export class SharedModule { }
