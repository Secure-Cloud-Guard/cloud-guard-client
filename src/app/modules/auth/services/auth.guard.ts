import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { LoginService } from "./login.service";

export const authGuard: CanActivateFn = () => {
  const loginService: LoginService = inject(LoginService);
  const router: Router = inject(Router);

  if (loginService.isLoggedIn) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
