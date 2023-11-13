import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '@modules/auth/components';
import { DashboardComponent } from "@modules/home/components";
import { PersonalVaultComponent } from "@modules/personal-vault/components";
import { StorageComponent } from "@modules/storage/components";
import { authGuard, loginActivateGuard } from "@modules/auth/services";
import { AppRoutes } from "@shared/const";

const routes: Routes = [
  { path: AppRoutes.LOGIN, component: LoginComponent, canActivate: [loginActivateGuard] },
  { path: AppRoutes.DASHBOARD, component: DashboardComponent, canActivate: [authGuard],
    children: [
      { path: AppRoutes.PERSONAL_VAULT, component: PersonalVaultComponent },
      { path: AppRoutes.STORAGE, component: StorageComponent },
      { path: '', redirectTo: `/${AppRoutes.DASHBOARD}/${AppRoutes.PERSONAL_VAULT}`, pathMatch: 'prefix' },
    ]
  },
  { path: '', redirectTo: `/${AppRoutes.DASHBOARD}/${AppRoutes.PERSONAL_VAULT}`, pathMatch: 'full' },
  { path: '**', redirectTo: `/${AppRoutes.DASHBOARD}/${AppRoutes.PERSONAL_VAULT}` },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
