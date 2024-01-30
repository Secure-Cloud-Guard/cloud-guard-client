import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { NgOptimizedImage } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { HeaderComponent, ThemeSwitchComponent, LogoComponent, GradientBackgroundComponent, AlertComponent } from "./components";
import { RouterLink } from "@angular/router";
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { environment } from "../../src/environments/environment";


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
      RouterLink,
      LoggerModule.forRoot({
        level: NgxLoggerLevel.TRACE,
        disableConsoleLogging: environment.production
      }),
    ]
})
export class SharedModule { }
