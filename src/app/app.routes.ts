import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.page').then((module) => module.DashboardPage),
  },
  {
    path: 'usuarios',
    loadChildren: () =>
      import('@mercadofabio/usuarios-lib').then((module) => module.usuariosRoutes),
  },
  {
    path: 'productos',
    loadChildren: () =>
      import('@mercadofabio/productos-lib').then((module) => module.productosRoutes),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
