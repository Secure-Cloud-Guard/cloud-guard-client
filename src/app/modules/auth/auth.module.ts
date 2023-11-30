import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LoginComponent, ParticlesComponent } from '@modules/auth/components';
import { SharedModule } from "@shared";
import { AmplifyAuthenticatorModule } from "@aws-amplify/ui-angular";
import { Amplify } from 'aws-amplify';
import awsconfig from '@app/../aws-exports';


Amplify.configure(awsconfig);


@NgModule({
  declarations: [
    LoginComponent,
    ParticlesComponent
  ],
  exports: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    NgOptimizedImage,
    SharedModule,
    MatTooltipModule,
    AmplifyAuthenticatorModule,
  ]
})
export class AuthModule { }
