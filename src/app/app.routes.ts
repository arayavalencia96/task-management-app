import { Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

import { FailedComponent } from './features/failed/failed.component';
import { HomeComponent } from './features/home/home.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'login-failed',
    component: FailedComponent,
  },
  { path: '**', redirectTo: '' },
];
