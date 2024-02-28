import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SharedModule } from "@globalShared";
import { HomeModule } from '@modules/home';
import { AppComponent } from '@app/app.component';
import { AppRoutingModule } from "@app/app-routing.module";
import { PersonalVaultModule } from "@modules/personal-vault";
import { ProfileModule } from "@modules/profile";
import { SettingsModule } from "@modules/settings";
import { StorageModule } from "@modules/storage";


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    BrowserModule,
    HttpClientModule,
    HomeModule,
    PersonalVaultModule,
    ProfileModule,
    SettingsModule,
    StorageModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
