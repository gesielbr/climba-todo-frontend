import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const nameGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.name().trim()) {
    return true;
  }

  // Sem nome → volta pro login (rota raiz)
  return router.createUrlTree(['']);
};
