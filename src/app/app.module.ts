import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "@shared";
import { AuthModule } from '@modules/auth';
import { HomeModule } from '@modules/home';
import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from "@app/app-routing.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
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
