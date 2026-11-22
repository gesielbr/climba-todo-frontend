import { Routes } from '@angular/router';

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
    path: 'tasks', // Ou 'dashboard' / 'home', como preferir chamar a URL
    loadComponent: () => import('./components/layout/layout').then((m) => m.Layout),
  },
];
