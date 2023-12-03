import { CanActivateFn } from '@angular/router';
import { inject } from "@angular/core";
import { LoginService } from "./login.service";

export const loginActivateGuard: CanActivateFn = () => {
  const loginService: LoginService = inject(LoginService);

  if (loginService.isLoggedIn) {
    loginService.logout();
  }

  return true;
};
