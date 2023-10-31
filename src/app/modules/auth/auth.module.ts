import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LoginComponent } from '@modules/auth/components/login/login.component';
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { SharedModule } from "@shared";
import { ParticlesComponent } from './components/particles/particles.component';
import { MatTooltipModule } from "@angular/material/tooltip";

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
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    NgOptimizedImage,
    SharedModule,
    MatTooltipModule
  ]
})
export class AuthModule { }
