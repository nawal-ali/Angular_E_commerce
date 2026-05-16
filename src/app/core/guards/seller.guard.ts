import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

export const sellerGuard: CanActivateFn = () => {
  const global = inject(GlobalService);
  const router = inject(Router);

  if (!global.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (!global.isSeller()) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};