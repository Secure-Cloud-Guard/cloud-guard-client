import { NgModule } from '@angular/core';
import { SharedModule } from "@shared";
import { AuthModule } from '@modules/auth';
import { BrowserModule } from '@angular/platform-browser';
import { HomeModule } from '@modules/home';

import { AppComponent } from '@app/app.component';
import { HttpClientModule } from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule,
    AuthModule,
    BrowserModule,
    HttpClientModule,
    HomeModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
