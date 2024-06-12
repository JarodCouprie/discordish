import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";

export const userGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwt = localStorage.getItem("jwt");

  if (jwt) {
    return true;
  }

  return router.createUrlTree(["/login"]);
};
