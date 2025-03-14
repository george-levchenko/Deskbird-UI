import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    loadComponent: () => import('./containers/core/layout/layout.component').then(c => c.LayoutComponent),
    canActivate: [],
    children: [{ path: 'dashboard', loadComponent: () => import('./containers/dashboard/dashboard.component').then(c => c.DashboardComponent) }],
  },
  { path: 'login', loadComponent: () => import('./containers/core/login/login.component').then(c => c.LoginComponent) },
  { path: '**', loadComponent: () => import('./containers/core/not-found/not-found.component').then(c => c.NotFoundComponent) },
];
