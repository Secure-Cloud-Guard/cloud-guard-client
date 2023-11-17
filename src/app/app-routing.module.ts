import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@modules/auth/components';
import { DashboardComponent } from "@modules/home/components";
import { PersonalVaultComponent } from "@modules/personal-vault/components";
import { StorageComponent } from "@modules/storage/components";
import { ProfileComponent } from "@modules/profile/components";
import { SettingsComponent } from "@modules/settings/components";
import { authGuard, loginActivateGuard } from "@modules/auth/services";
import { AppRoutes } from "@shared/const";

const routes: Routes = [
  { path: AppRoutes.LOGIN.relativePath, component: LoginComponent, canActivate: [loginActivateGuard] },
  { path: AppRoutes.DASHBOARD.relativePath, component: DashboardComponent, canActivate: [authGuard],
    children: [
      { path: AppRoutes.PERSONAL_VAULT.relativePath, component: PersonalVaultComponent },
      { path: AppRoutes.STORAGE.relativePath, component: StorageComponent },
      { path: AppRoutes.PROFILE.relativePath, component: ProfileComponent },
      { path: AppRoutes.SETTINGS.relativePath, component: SettingsComponent },
      { path: '', redirectTo: AppRoutes.PERSONAL_VAULT.fullPath, pathMatch: 'prefix' },
    ]
  },
  { path: '', redirectTo: AppRoutes.PERSONAL_VAULT.fullPath, pathMatch: 'full' },
  { path: '**', redirectTo: AppRoutes.PERSONAL_VAULT.fullPath },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
