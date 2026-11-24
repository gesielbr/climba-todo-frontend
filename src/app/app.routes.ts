import { Routes } from '@angular/router';
import { nameGuard } from './guards/name.guard';
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'login',
    redirectTo: '',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    canActivate: [nameGuard],
    loadComponent: () => import('./components/layout/layout').then((m) => m.Layout),
  },
];
