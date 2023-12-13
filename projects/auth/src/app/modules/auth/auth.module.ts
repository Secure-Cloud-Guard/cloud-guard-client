import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDividerModule } from "@angular/material/divider";
import { MatStepperModule } from "@angular/material/stepper";
import { CodeInputModule } from 'angular-code-input';
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";
import { LoginComponent, ParticlesComponent, SocialIconsComponent, SignUpComponent } from '@modules/auth/components';
import { SharedModule } from '@globalShared'
import { environment } from "@app/../../../../src/environments/environment";


@NgModule({
  declarations: [
    LoginComponent,
    ParticlesComponent,
    SocialIconsComponent,
    SignUpComponent
  ],
  exports: [
    LoginComponent,
    SignUpComponent,
    ParticlesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
    SharedModule,
    MatTooltipModule,
    MatDividerModule,
    MatStepperModule,
    CodeInputModule,
    FormsModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
      disableConsoleLogging: environment.production
    }),
  ]
})
export class AuthModule { }
