import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { LoginComponent, SignUpComponent } from '@modules/auth/components';
import { loginActivateGuard } from "@modules/auth/services";
import { AppRoutes } from "@globalShared";

const routes: Routes = [
  { path: AppRoutes.AUTH.LOGIN.relativePath, component: LoginComponent, canActivate: [loginActivateGuard] },
  { path: AppRoutes.AUTH.SIGN_UP.relativePath, component: SignUpComponent },
  { path: '', redirectTo: AppRoutes.AUTH.LOGIN.fullPath, pathMatch: 'full' },
  { path: '**', redirectTo: AppRoutes.AUTH.LOGIN.fullPath },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
})
export class AppRoutingModule {}
