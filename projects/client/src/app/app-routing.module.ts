import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { DashboardComponent } from "@modules/home/components";
import { PersonalVaultComponent } from "@modules/personal-vault/components";
import { StorageComponent } from "@modules/storage/components";
import { ProfileComponent } from "@modules/profile/components";
import { SettingsComponent } from "@modules/settings/components";
import { AppRoutes } from "@globalShared";

const routes: Routes = [
  { path: AppRoutes.MAIN.DASHBOARD.relativePath, component: DashboardComponent,
    children: [
      { path: AppRoutes.MAIN.PERSONAL_VAULT.relativePath, component: PersonalVaultComponent },
      { path: AppRoutes.MAIN.STORAGE.relativePath, component: StorageComponent },
      { path: AppRoutes.MAIN.PROFILE.relativePath, component: ProfileComponent },
      { path: AppRoutes.MAIN.SETTINGS.relativePath, component: SettingsComponent },
      { path: '', redirectTo: AppRoutes.MAIN.PERSONAL_VAULT.fullPath, pathMatch: 'prefix' },
    ]
  },
  { path: '', redirectTo: AppRoutes.MAIN.PERSONAL_VAULT.fullPath, pathMatch: 'full' },
  { path: '**', redirectTo: AppRoutes.MAIN.PERSONAL_VAULT.fullPath },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppRoutingModule {}
