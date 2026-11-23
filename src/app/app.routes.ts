import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/trips/trip-list/trip-list').then((m) => m.TripList),
      },
      {
        path: 'trips/new',
        loadComponent: () => import('./features/trips/trip-form/trip-form').then((m) => m.TripForm),
      },
      {
        path: 'trips/:id/edit',
        loadComponent: () => import('./features/trips/trip-form/trip-form').then((m) => m.TripForm),
      },
      {
        path: 'trips/:id',
        loadComponent: () =>
          import('./features/trips/trip-detail/trip-detail').then((m) => m.TripDetail),
      },
      {
        path: 'calendar',
        loadComponent: () => import('./features/calendar/calendar').then((m) => m.Calendar),
      },
      {
        path: 'notifications',
        loadComponent: () =>
          import('./features/notifications/notifications').then((m) => m.Notifications),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
