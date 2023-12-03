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
import { MatDividerModule } from "@angular/material/divider";
import { LoginComponent, ParticlesComponent } from '@modules/auth/components';
import { SharedModule } from '@globalShared'


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
    MatDividerModule,
  ]
})
export class AuthModule { }
